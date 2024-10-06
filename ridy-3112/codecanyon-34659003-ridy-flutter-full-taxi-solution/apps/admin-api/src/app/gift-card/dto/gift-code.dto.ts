import { ID, ObjectType } from '@nestjs/graphql';
import {
  Authorize,
  FilterableField,
  IDField,
  Relation,
} from '@ptc-org/nestjs-query-graphql';
import { RiderTransactionDTO } from '../../rider/dto/rider-transaction.dto';
import { DriverTransactionDTO } from '../../driver/dto/driver-transaction.dto';
import { GiftCodeAuthorizer } from '../gift-code.authorizer';

@ObjectType('GiftCode')
@Relation('riderTransaction', () => RiderTransactionDTO, { nullable: true })
@Relation('driverTransaction', () => DriverTransactionDTO, { nullable: true })
@Authorize(GiftCodeAuthorizer)
export class GiftCodeDTO {
  @IDField(() => ID)
  id: number;
  code: string;

  @FilterableField({ nullable: true })
  usedAt?: Date;
  giftId: number;
}
