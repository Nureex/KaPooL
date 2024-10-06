import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { Point } from '@ridy/database';
import { PaymentMode } from '@ridy/database/enums/payment-mode.enum';

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  serviceId!: number;
  points!: Point[];
  addresses!: string[];
  @Field(() => Int)
  intervalMinutes!: number;
  twoWay?: boolean;
  @Field(() => Int)
  waitTime?: number;
  optionIds?: string[];
  couponCode?: string;
  paymentMode?: PaymentMode;
  @Field(() => ID, { nullable: true })
  paymentMethodId?: number;
}
