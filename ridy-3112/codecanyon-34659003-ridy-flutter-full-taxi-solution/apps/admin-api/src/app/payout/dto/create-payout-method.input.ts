import { InputType } from '@nestjs/graphql';
import { PayoutMethodType } from '@ridy/database/enums/payout-method-type.enum';

@InputType()
export class CreatePayoutMethodInput {
  enabled?: boolean;
  name!: string;
  description!: string;
  currency!: string;
  type!: PayoutMethodType;
  publicKey?: string;
  privateKey?: string;
  saltKey?: string;
  merchantId?: string;
  mediaId?: number;
  deletedAt?: Date;
}
