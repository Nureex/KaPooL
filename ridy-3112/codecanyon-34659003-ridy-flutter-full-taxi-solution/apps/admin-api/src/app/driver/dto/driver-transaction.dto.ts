import {
  FilterableField,
  FilterableRelation,
  Relation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DriverDeductTransactionType } from '@ridy/database/enums/driver-deduct-transaction-type.enum';
import { DriverRechargeTransactionType } from '@ridy/database/enums/driver-recharge-transaction-type.enum';
import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';
import { TransactionStatus } from '@ridy/database/enums/transaction-status.enum';
import { OperatorDTO } from '../../operator/dto/operator.dto';
import { PayoutAccountDTO } from '../../payout/dto/payout-account.dto';
import { DriverDTO } from './driver.dto';

@ObjectType('DriverTransaction')
@Relation('operator', () => OperatorDTO, { nullable: true })
@Relation('driver', () => DriverDTO, { nullable: true })
@Relation('payoutAccount', () => PayoutAccountDTO, {
  nullable: true,
})
export class DriverTransactionDTO {
  @FilterableField(() => ID)
  id!: number;
  @FilterableField()
  createdAt: Date;
  action: TransactionAction;
  @FilterableField(() => TransactionStatus)
  status: TransactionStatus;
  deductType?: DriverDeductTransactionType;
  rechargeType?: DriverRechargeTransactionType;
  @FilterableField()
  amount: number;
  currency: string;
  refrenceNumber?: string;
  @FilterableField(() => ID)
  driverId!: number;
  @FilterableField(() => ID)
  paymentGatewayId?: number;
  @FilterableField(() => ID)
  payoutSessionId?: number;
  @FilterableField(() => ID)
  payoutAccountId?: number;
  @FilterableField(() => ID)
  payoutMethodId?: number;
  @Field(() => ID)
  operatorId?: number;
  requestId?: number;
  description?: string;
}
