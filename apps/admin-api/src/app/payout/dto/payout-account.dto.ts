import { ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  IDField,
  Relation,
} from '@ptc-org/nestjs-query-graphql';
import { SavedPaymentMethodType } from '@ridy/database/enums/saved-payment-method-type';
import { PayoutMethodDTO } from './payout-method.dto';

@ObjectType('PayoutAccount')
@Relation('payoutMethod', () => PayoutMethodDTO)
export class PayoutAccountDTO {
  @IDField(() => ID)
  id: number;
  name: string;
  type: SavedPaymentMethodType;
  last4: string;
  currency: string;
  payoutMethodId: number;
  @FilterableField()
  isDefault: true;
  accountNumber?: string;
  routingNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  accountHolderAddress?: string;
  accountHolderCity?: string;
  accountHolderState?: string;
  accountHolderZip?: string;
  accountHolderCountry?: string;
  accountHolderPhone?: string;
  accountHolderDateOfBirth?: Date;
  isVerified!: boolean;
}
