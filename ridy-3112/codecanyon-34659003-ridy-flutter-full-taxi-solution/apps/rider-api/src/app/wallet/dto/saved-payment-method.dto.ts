import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProviderBrand } from '../../../../../../libs/database/src/lib/entities/enums/card-type.enum';
import {
  AuthorizationContext,
  Authorize,
  BeforeFindOne,
  FilterableField,
  FindOneArgsType,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { SavedPaymentMethodType } from '@ridy/database/enums/saved-payment-method-type';
import { UserContext } from '../../auth/authenticated-user';
import { Logger } from '@nestjs/common';

@ObjectType('SavedPaymentMethod')
@Authorize({
  authorize: (
    context: UserContext,
    authorizationContext: AuthorizationContext,
  ) => {
    if (authorizationContext.many == true) {
      return {
        riderId: { eq: context.req.user.id },
      };
    }
  },
})
export class SavedPaymentMethodDto {
  @IDField(() => ID)
  id: number;
  type!: SavedPaymentMethodType;
  lastFour?: string;
  isEnabled!: boolean;
  isDefault!: boolean;
  providerBrand?: ProviderBrand;
  title!: string;
  expiryDate?: Date;
  holderName?: string;
  @FilterableField(() => ID, { filterOnly: true })
  riderId: number;
}
