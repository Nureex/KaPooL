import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class PayoutAccountInput {
  name!: string;
  @Field(() => ID)
  payoutMethodId!: number;
  accountNumber!: string;
  routingNumber?: string;
  bankName!: string;
  accountHolderName?: string;
  branchName?: string;
  isDefault!: boolean;
  accountHolderAddress?: string;
  accountHolderCity?: string;
  accountHolderState?: string;
  accountHolderZip?: string;
  accountHolderCountry?: string;
  accountHolderPhone?: string;
  accountHolderDateOfBirth?: Date;
}
