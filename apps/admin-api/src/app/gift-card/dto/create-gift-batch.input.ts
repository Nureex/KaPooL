import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateGiftBatchInput {
  name: string;
  currency: string;

  amount: number;
  availableFrom?: Date;
  expireAt?: Date;
  quantity: number;
}
