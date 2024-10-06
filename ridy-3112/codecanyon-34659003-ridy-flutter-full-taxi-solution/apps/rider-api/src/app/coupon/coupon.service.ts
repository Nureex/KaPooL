import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponEntity } from '@ridy/database/coupon.entity';
import { RiderRechargeTransactionType } from '@ridy/database/enums/rider-recharge-transaction-type.enum';
import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';
import { TransactionStatus } from '@ridy/database/enums/transaction-status.enum';
import { SharedRiderService } from '@ridy/order/shared-rider.service';
import { ForbiddenError } from '@nestjs/apollo';
import { Repository } from 'typeorm';
import { RiderWalletDTO } from '../wallet/dto/rider-wallet.dto';

@Injectable()
export class CouponService {
  constructor(private sharedRiderService: SharedRiderService) {}
}
