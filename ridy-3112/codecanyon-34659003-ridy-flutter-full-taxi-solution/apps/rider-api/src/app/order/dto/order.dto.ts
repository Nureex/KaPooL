import {
  Authorize,
  FilterableField,
  IDField,
  Relation,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Point } from '@ridy/database';
import { OrderStatus } from '@ridy/database/enums/order-status.enum';

import { UserContext } from '../../auth/authenticated-user';
import { OrderMessageDTO } from '../../chat/dto/order-message.dto';
import { RiderDTO } from '../../rider/dto/rider.dto';
import { ServiceOptionDTO } from '../../service/dto/service-option.dto';
import { ServiceDTO } from '../../service/dto/service.dto';
import { PaymentGatewayDTO } from '../../wallet/dto/payment-gateway.dto';
import { DriverDTO } from './driver.dto';
import { SavedPaymentMethodDto } from '../../wallet/dto/saved-payment-method.dto';
import { PaymentMode } from '@ridy/database/enums/payment-mode.enum';

@ObjectType('Order')
@Authorize({
  authorize: (context: UserContext) => ({
    riderId: { eq: context.req.user.id },
  }),
})
@Relation('driver', () => DriverDTO, {
  nullable: true,
})
@Relation('rider', () => RiderDTO, {
  nullable: true,
})
@Relation('service', () => ServiceDTO, {
  nullable: true,
})
@UnPagedRelation('options', () => ServiceOptionDTO)
@Relation('paymentGateway', () => PaymentGatewayDTO, {
  nullable: true,
})
@Relation('savedPaymentMethod', () => SavedPaymentMethodDto, {
  nullable: true,
})
@UnPagedRelation('conversation', () => OrderMessageDTO, {
  relationName: 'conversation',
})
export class OrderDTO {
  @IDField(() => ID)
  id: number;
  @FilterableField(() => OrderStatus)
  status: OrderStatus;
  @FilterableField()
  createdOn: Date;
  @FilterableField(() => Int)
  distanceBest!: number;
  @Field(() => Int)
  durationBest!: number;
  @Field(() => Int)
  waitMinutes!: number;
  waitCost!: number;
  rideOptionsCost!: number;
  taxCost!: number;
  serviceCost!: number;
  points: Point[];
  addresses: string[];
  expectedTimestamp!: Date;
  driverLastSeenMessagesAt!: Date;
  riderLastSeenMessagesAt!: Date;
  @Field(() => Int)
  destinationArrivedTo!: number;
  startTimestamp?: Date;
  finishTimestamp?: Date;
  @FilterableField(() => ID)
  riderId: number;
  @FilterableField(() => ID, { nullable: true })
  driverId?: number;
  costAfterCoupon: number;
  paymentMode?: PaymentMode;
  @FilterableField(() => ID, { nullable: true })
  paymentGatewayId?: number;
  @FilterableField(() => ID, { nullable: true })
  paymentMethodId?: number;
  etaPickup?: Date;
  costBest: number;
  paidAmount: number;
  tipAmount: number;
  providerShare: number;
  currency: string;
  directions?: Point[];
  driverDirections?: Point[];
}
