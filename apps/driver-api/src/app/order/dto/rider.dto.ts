import {
  IDField,
  Relation,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { MediaDTO } from '../../upload/media.dto';
import { RiderWalletDTO } from './rider-wallet.dto';

@ObjectType('Rider')
@Relation('media', () => MediaDTO, {
  nullable: true,
})
@UnPagedRelation('wallets', () => RiderWalletDTO)
export class RiderDTO {
  @IDField(() => ID)
  id!: number;
  firstName?: string;
  lastName?: string;
  mobileNumber: string;
  @Field(() => Int, { nullable: true })
  presetAvatarNumber?: number;
}
