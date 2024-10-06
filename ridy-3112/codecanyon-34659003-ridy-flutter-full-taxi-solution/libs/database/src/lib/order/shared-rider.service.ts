import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RiderEntity } from '../entities/rider-entity';
import { RiderTransactionEntity } from '../entities/rider-transaction.entity';
import { RiderWalletEntity } from '../entities/rider-wallet.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { VerifyHash } from '../redis/auth-redis.service';
import { DriverEntity } from '../entities/driver.entity';

@Injectable()
export class SharedRiderService {
  constructor(
    @InjectRepository(RiderEntity)
    public repo: Repository<RiderEntity>,
    @InjectRepository(DriverEntity)
    private driverRepo: Repository<DriverEntity>,
    @InjectRepository(RiderWalletEntity)
    private riderWalletRepo: Repository<RiderWalletEntity>,
    @InjectRepository(RiderTransactionEntity)
    private riderTransactionRepo: Repository<RiderTransactionEntity>,
  ) {}

  async findById(id: number): Promise<RiderEntity> {
    return this.repo.findOneOrFail({ where: { id }, withDeleted: true });
  }

  async addDriverToFavoriteList(input: {
    riderId: number;
    driverId: number;
  }): Promise<boolean> {
    const rider = await this.repo.findOneOrFail({
      where: { id: input.riderId },
      relations: {
        favoriteDrivers: true,
      },
    });
    const favoriteDrivers = rider.favoriteDrivers;
    if (
      favoriteDrivers.some(
        (driver: DriverEntity) => driver.id === input.driverId,
      )
    ) {
      return false;
    }
    favoriteDrivers.push(
      await this.driverRepo
        .createQueryBuilder('driver')
        .where('driver.id = :id', { id: input.driverId })
        .getOneOrFail(),
    );
    await this.repo.save(rider);

    return true;
  }

  async findWithDeleted(
    filter: FindOptionsWhere<RiderEntity>,
  ): Promise<RiderEntity | null> {
    return this.repo.findOne({ where: filter, withDeleted: true });
  }

  private async findUserByMobileNumber(
    mobileNumber: string,
  ): Promise<RiderEntity | null> {
    return this.repo.findOne({ where: { mobileNumber }, withDeleted: true });
  }

  private async createUserWithMobileNumber(
    input: Omit<VerifyHash, 'code'>,
  ): Promise<RiderEntity> {
    Logger.log('creating rider with ');
    const rider = this.repo.create({
      mobileNumber: input.mobileNumber,
      countryIso: input.countryIso,
    });
    const riderEntity = await this.repo.save(rider);
    return riderEntity;
  }

  async findOrCreateUserWithMobileNumber(input: {
    mobileNumber: string;
    countryIso?: string;
  }): Promise<RiderEntity> {
    const findResult = await this.findUserByMobileNumber(input.mobileNumber);
    if (findResult?.deletedAt != null) {
      await this.repo.restore(findResult?.id);
    }
    if (findResult == null) {
      return await this.createUserWithMobileNumber(input);
    } else {
      return findResult;
    }
  }

  async deleteById(id: number): Promise<RiderEntity> {
    const user = await this.findById(id);
    await this.repo.softDelete(id);
    return user;
  }

  async getRiderCreditInCurrency(riderId: number, currency: string) {
    const wallet = await this.riderWalletRepo.findOneBy({ riderId, currency });
    return wallet?.balance ?? 0;
  }

  async rechargeWallet(
    transaction: Pick<
      RiderTransactionEntity,
      | 'status'
      | 'action'
      | 'rechargeType'
      | 'deductType'
      | 'amount'
      | 'currency'
      | 'riderId'
      | 'requestId'
      | 'operatorId'
      | 'paymentGatewayId'
      | 'refrenceNumber'
      | 'description'
      | 'giftCardId'
    >,
  ): Promise<RiderWalletEntity> {
    let wallet = await this.riderWalletRepo.findOneBy({
      riderId: transaction.riderId,
      currency: transaction.currency,
    });
    if (wallet == null) {
      wallet = await this.riderWalletRepo.save({
        balance: transaction.amount,
        currency: transaction.currency,
        riderId: transaction.riderId,
      });
    } else {
      await this.riderWalletRepo.update(wallet.id, {
        balance: transaction.amount + wallet.balance,
      });
      wallet.balance += transaction.amount;
    }
    this.riderTransactionRepo.save(transaction);
    return wallet;
  }
}
