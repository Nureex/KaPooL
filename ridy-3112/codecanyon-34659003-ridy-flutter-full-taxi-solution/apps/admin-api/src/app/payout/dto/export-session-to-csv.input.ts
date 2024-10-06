import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class ExportSessionToCsvInput {
  @Field(() => ID)
  payoutSessionId!: number;
  @Field(() => ID)
  payoutMethodId?: number;
}
