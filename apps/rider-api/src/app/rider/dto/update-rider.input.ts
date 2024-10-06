import {
  BeforeUpdateOne,
  UpdateOneInputType,
} from '@ptc-org/nestjs-query-graphql';
import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { Gender } from '@ridy/database/enums/gender.enum';
import { RiderDocumentType } from '@ridy/database/enums/rider-document-type';
import { UserContext } from '../../auth/authenticated-user';

@InputType()
@BeforeUpdateOne(
  (input: UpdateOneInputType<UpdateRiderInput>, context: UserContext) => {
    input.id = context.req.user.id;
    return input;
  },
)
export class UpdateRiderInput {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  email?: string;
  notificationPlayerId?: string;
  password?: string;
  isResident?: boolean;
  idNumber?: string;
  @Field(() => ID, { nullable: true })
  mediaId?: number;
  @Field(() => Int, { nullable: true })
  presetAvatarNumber?: number;
  documentType?: RiderDocumentType;
}
