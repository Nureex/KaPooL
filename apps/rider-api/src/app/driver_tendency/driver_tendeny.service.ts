import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RiderEntity } from '@ridy/database/rider-entity';
import { Repository } from 'typeorm';

@Injectable()
export class DriverTendencyService {
  constructor(
    @InjectRepository(RiderEntity)
    private riderRepo: Repository<RiderEntity>,
  ) {}

  async deleteFavoriteDriver(riderId: number, driverId: number): Promise<void> {
    await this.riderRepo
      .createQueryBuilder()
      .relation(RiderEntity, 'favoriteDrivers')
      .of(riderId)
      .remove(driverId);
  }
}
