import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePayoutMethodInput {
  @Field(() => ID)
  id: number;
  isDefault: boolean;
}
