import { Field, InputType } from '@nestjs/graphql';
import { PayoutSessionStatus } from '@ridy/database/enums/payout-session-status.enum';

@InputType()
export class UpdatePayoutSessionInput {
  @Field(() => PayoutSessionStatus)
  status: PayoutSessionStatus;
}
