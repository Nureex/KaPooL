import { InjectPubSub } from '@ptc-org/nestjs-query-graphql';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from '@ridy/database';
import { DriverStatus } from '@ridy/database/enums/driver-status.enum';
import { OrderStatus } from '@ridy/database/enums/order-status.enum';
import { PaymentStatus } from '@ridy/database/enums/payment-status.enum';
import { RequestActivityType } from '@ridy/database/enums/request-activity-type.enum';
import { PaymentEntity } from '@ridy/database/payment.entity';
import { RequestActivityEntity } from '@ridy/database/request-activity.entity';
import { RequestEntity } from '@ridy/database/request.entity';
import { SharedDriverService } from '@ridy/order/shared-driver.service';
import { SharedFleetService } from '@ridy/order/shared-fleet.service';
import { OrderRedisService } from '@ridy/redis/order-redis.service';
import { ForbiddenError } from '@nestjs/apollo';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { firstValueFrom } from 'rxjs';
import { In, Repository } from 'typeorm';
import { DriverEntity } from '@ridy/database/driver.entity';
import { RiderReviewInput } from './dto/rider-review.input';
import { RiderReviewEntity } from '@ridy/database/rider-review.entity';
import { RiderEntity } from '@ridy/database/rider-entity';
import { OrderDTO } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(RequestEntity)
    public orderRepository: Repository<RequestEntity>,
    @InjectRepository(RequestActivityEntity)
    public activityRepository: Repository<RequestActivityEntity>,
    @InjectRepository(PaymentEntity)
    public paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(RiderReviewEntity)
    public reviewRepository: Repository<RiderReviewEntity>,
    @InjectRepository(DriverEntity)
    public driverRepository: Repository<DriverEntity>,
    @InjectRepository(RiderEntity)
    public riderRepository: Repository<RiderEntity>,

    private driverService: SharedDriverService,
    private orderRedisService: OrderRedisService,
    private sharedFleetService: SharedFleetService,
    @InjectPubSub()
    private pubSub: RedisPubSub,
    private httpService: HttpService,
  ) {}

  async cancelOrder(orderId: number): Promise<RequestEntity> {
    let order = await this.orderRepository.findOneBy({ id: orderId });
    const allowedStatuses = [
      OrderStatus.DriverAccepted,
      OrderStatus.Arrived,
      OrderStatus.DriverCanceled,
    ];
    Logger.log(
      `canceling order ${JSON.stringify(order)}`,
      'OrderService.cancelOrder',
    );
    if (order == null || !allowedStatuses.includes(order.status)) {
      throw new ForbiddenError('CANCEL_NOT_ALLOWED');
    }
    await this.orderRepository.update(order.id, {
      status: OrderStatus.DriverCanceled,
      finishTimestamp: new Date(),
      costAfterCoupon: 0,
    });
    order = await this.orderRepository.findOneBy({ id: order.id });
    const payments = await this.paymentRepository.find({
      where: {
        userType: 'client',
        userId: order.riderId.toString(),
        status: PaymentStatus.Authorized,
        orderNumber: order.id.toString(),
      },
      order: { id: 'DESC' },
    });
    for (let payment of payments) {
      await firstValueFrom(
        this.httpService.get<{ status: 'OK' | 'FAILED' }>(
          `${process.env.GATEWAY_SERVER_URL}/cancel_preauth?id=${payment.transactionNumber}`,
        ),
      );
    }
    await this.driverService.updateDriverStatus(
      order.driverId,
      DriverStatus.Online,
    );
    return order;
  }

  async expireOrders(orderIds: number[]) {
    this.orderRedisService.expire(orderIds);
    await this.orderRepository.update(orderIds, {
      status: OrderStatus.Expired,
    });
    const orders = await this.orderRepository.find({
      where: { id: In(orderIds) },
    });
    for (const order of orders) {
      this.pubSub.publish('orderUpdated', { orderUpdated: order });
      this.pubSub.publish('orderRemoved', { orderRemoved: order });
    }
    for (const requestId of orderIds) {
      this.activityRepository.insert({
        requestId,
        type: RequestActivityType.Expired,
      });
    }
  }

  async getOrdersForDriverWithId(driverId: number): Promise<RequestEntity[]> {
    const driver = await this.driverService.findById(driverId);
    return this.getOrdersForDriverEntity(driver);
  }

  async submitReview(
    input: RiderReviewInput & { driverId: number },
  ): Promise<OrderDTO> {
    const order = await this.orderRepository.findOneBy({
      id: input.orderId,
      driverId: input.driverId,
    });
    if (order == null) {
      throw new ForbiddenError('ORDER_NOT_FOUND');
    }
    if (order.status != OrderStatus.Finished) {
      throw new ForbiddenError('ORDER_NOT_FINISHED');
    }
    const review = await this.reviewRepository.findOneBy({
      orderId: order.id,
    });
    if (review != null) {
      throw new ForbiddenError('ALREADY_REVIEWED');
    }
    const rider = await this.riderRepository.findOneBy({
      id: order.riderId,
    });
    if (rider == null) {
      throw new ForbiddenError('RIDER_NOT_FOUND');
    }
    const newReview = this.reviewRepository.create({
      orderId: order.id,
      riderId: rider.id,
      driverId: order.driverId,
      score: input.score,
      description: input.description,
    });
    await this.reviewRepository.save(newReview);
    return order;
  }

  async getOrdersForDriverEntity(
    driver: DriverEntity,
  ): Promise<RequestEntity[]> {
    Logger.log(`getting orders for driver ${JSON.stringify(driver)}`);
    const orderIds = (
      await this.orderRedisService.getForDriver(
        driver.id,
        driver.searchDistance,
      )
    ).map((id) => parseInt(id));
    Logger.log(`got order ids ${JSON.stringify(orderIds)}`);
    let orders = await this.orderRepository.find({
      where: {
        id: In(orderIds),
        serviceId: In(driver.enabledServices.map((service) => service.id)),
        status: In([
          OrderStatus.NoCloseFound,
          OrderStatus.NoCloseFound,
          OrderStatus.Found,
          OrderStatus.Booked,
          OrderStatus.Requested,
        ]),
      },
      relations: ['service', 'options'],
    });
    Logger.log(`got orders ${JSON.stringify(orders)}`);
    for (let order of orders) {
      const fleetIds = await this.sharedFleetService.getFleetIdsInPoint(
        order.points[0],
      );
      if (
        fleetIds.length > 0 &&
        (!fleetIds.includes(driver.fleetId) || driver.fleetId == null)
      ) {
        orders = orders.filter((_order) => _order.id != order.id);
      }
    }
    Logger.log(
      `got filtered orders by fleet criteria ${JSON.stringify(orders)}`,
    );

    return orders;
  }
}
