import { ID, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';

@ObjectType('GiftCard')
export class GiftCardDTO {
  @IDField(() => ID)
  id!: number;
  amount!: number;
  currency!: string;
}
