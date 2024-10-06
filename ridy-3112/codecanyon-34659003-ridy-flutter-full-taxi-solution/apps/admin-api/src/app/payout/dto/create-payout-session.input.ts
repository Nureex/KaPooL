import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePayoutSessionInput {
  @Field(() => [ID])
  payoutMethodIds: number[];
  minimumAmount: number;
  currency: string;
  description?: string;
}
