import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiderEntity } from '@ridy/database/rider-entity';
import { DriverTendencyService } from './driver_tendeny.service';
import { DriverTendencyResolver } from './driver_tendency.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RiderEntity])],
  providers: [DriverTendencyService, DriverTendencyResolver],
})
export class DriverTendencyModule {}
