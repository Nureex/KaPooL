import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RiderReviewInput {
  @Field(() => Int, { description: 'Score, a value between 0 to 100' })
  score!: number;
  description?: string;
  @Field(() => String, { description: 'Order ID' })
  orderId!: number;
}
