import { ID, ObjectType } from '@nestjs/graphql';
import {
  Authorize,
  IDField,
  OffsetConnection,
  Relation,
} from '@ptc-org/nestjs-query-graphql';
import { GiftCodeDTO } from './gift-code.dto';
import { GiftBatchAuthorizer } from '../gift-batch.authorizer';

@ObjectType('GiftBatch')
@OffsetConnection('giftCodes', () => GiftCodeDTO, {
  enableTotalCount: true,
  enableAggregate: true,
})
@Authorize(GiftBatchAuthorizer)
export class GiftBatchDTO {
  @IDField(() => ID)
  id: number;
  name: string;
  currency!: string;
  amount: number;
  availableFrom?: Date;
  expireAt?: Date;
}
