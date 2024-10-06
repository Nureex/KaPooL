import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class ManualPayoutInput {
  @Field(() => ID)
  driverTransactionId: number;
  transactionNumber: string;
  description?: string;
}
