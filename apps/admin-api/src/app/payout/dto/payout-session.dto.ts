import { ID, ObjectType } from '@nestjs/graphql';
import {
  Authorize,
  IDField,
  OffsetConnection,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { PayoutSessionStatus } from '@ridy/database/enums/payout-session-status.enum';
import { DriverTransactionDTO } from '../../driver/dto/driver-transaction.dto';
import { PayoutMethodDTO } from './payout-method.dto';
import { PayoutAuthorizer } from '../payout.authorizer';

@ObjectType('PayoutSession')
@OffsetConnection('driverTransactions', () => DriverTransactionDTO, {
  enableAggregate: true,
})
@UnPagedRelation('payoutMethods', () => PayoutMethodDTO)
@Authorize(PayoutAuthorizer)
export class PayoutSessionDTO {
  @IDField(() => ID)
  id!: number;
  createdAt!: Date;
  processedAt?: Date;
  description?: string;
  status!: PayoutSessionStatus;
  totalAmount!: number;
  currency!: string;
}
