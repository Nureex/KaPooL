import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponEntity } from '@ridy/database/coupon.entity';
import { RequestEntity } from '@ridy/database/request.entity';

import { CommonCouponService } from './common-coupon.service';
import { CommonGiftCardService } from './common-gift-card.service';
import { GiftCodeEntity } from '@ridy/database/gift-code.entity';
import { SharedRiderService } from '@ridy/order/shared-rider.service';
import { SharedDriverService } from '@ridy/order/shared-driver.service';
import { RiderEntity } from '@ridy/database/rider-entity';
import { DriverEntity } from '@ridy/database/driver.entity';
import { RiderWalletEntity } from '@ridy/database/rider-wallet.entity';
import { DriverWalletEntity } from '@ridy/database/driver-wallet.entity';
import { RiderTransactionEntity } from '@ridy/database/rider-transaction.entity';
import { DriverTransactionEntity } from '@ridy/database/driver-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      RiderEntity,
      DriverEntity,
      CouponEntity,
      RiderWalletEntity,
      DriverWalletEntity,
      RiderTransactionEntity,
      DriverTransactionEntity,
      GiftCodeEntity,
    ]),
  ],
  providers: [
    CommonCouponService,
    CommonGiftCardService,
    SharedRiderService,
    SharedDriverService,
  ],
  exports: [CommonCouponService, CommonGiftCardService],
})
export class CommonCouponModule {}
