import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCouponModule } from '../coupon/common-coupon.module';
import { RedisPubSubProvider } from '../redis-pub-sub.provider';
import { DriverTransactionEntity } from '../entities/driver-transaction.entity';
import { DriverWalletEntity } from '../entities/driver-wallet.entity';
import { DriverEntity } from '../entities/driver.entity';
import { FleetTransactionEntity } from '../entities/fleet-transaction.entity';
import { FleetWalletEntity } from '../entities/fleet-wallet.entity';
import { FleetEntity } from '../entities/fleet.entity';
import { PaymentEntity } from '../entities/payment.entity';
import { ProviderTransactionEntity } from '../entities/provider-transaction.entity';
import { ProviderWalletEntity } from '../entities/provider-wallet.entity';
import { RequestActivityEntity } from '../entities/request-activity.entity';
import { RequestEntity } from '../entities/request.entity';
import { RiderEntity } from '../entities/rider-entity';
import { RiderTransactionEntity } from '../entities/rider-transaction.entity';
import { RiderWalletEntity } from '../entities/rider-wallet.entity';
import { ServiceCategoryEntity } from '../entities/service-category.entity';
import { ServiceOptionEntity } from '../entities/service-option.entity';
import { ServiceEntity } from '../entities/service.entity';
import { ZonePriceEntity } from '../entities/zone-price.entity';
import { RedisHelpersModule } from '../redis/redis-helper.module';
import { SharedConfigurationService } from '../shared-configuration.service';
import { FirebaseNotificationModule } from './firebase-notification-service/firebase-notification-service.module';
import { GoogleServicesModule } from './google-services/google-services.module';
import { RegionModule } from './region/region.module';
import { ServiceService } from './service.service';
import { SharedDriverService } from './shared-driver.service';
import { SharedFleetService } from './shared-fleet.service';
import { SharedOrderService } from './shared-order.service';
import { SharedProviderService } from './shared-provider.service';
import { SharedRiderService } from './shared-rider.service';

@Module({
  imports: [
    RedisHelpersModule,
    CommonCouponModule,
    TypeOrmModule.forFeature([
      ServiceCategoryEntity,
      ServiceOptionEntity,
      ServiceEntity,
      RiderEntity,
      DriverEntity,
      DriverWalletEntity,
      DriverTransactionEntity,
      FleetEntity,
      FleetWalletEntity,
      FleetTransactionEntity,
      ProviderWalletEntity,
      ProviderTransactionEntity,
      RiderWalletEntity,
      RiderTransactionEntity,
      RequestEntity,
      RequestActivityEntity,
      ZonePriceEntity,
      PaymentEntity,
    ]),
    HttpModule,
    RegionModule,
    GoogleServicesModule,
    FirebaseNotificationModule.register(),
  ],
  providers: [
    RedisPubSubProvider.provider(),
    ServiceService,
    SharedDriverService,
    SharedFleetService,
    SharedOrderService,
    SharedProviderService,
    SharedRiderService,
    SharedConfigurationService,
  ],
  exports: [
    SharedDriverService,
    SharedFleetService,
    SharedOrderService,
    SharedProviderService,
    SharedRiderService,
  ],
})
export class SharedOrderModule {}
