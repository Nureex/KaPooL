import { ID, ObjectType } from '@nestjs/graphql';
import {
  Authorize,
  FilterableField,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { ProviderBrand } from '@ridy/database/enums/card-type.enum';
import { SavedPaymentMethodType } from '@ridy/database/enums/saved-payment-method-type';
import { UserContext } from '../../auth/authenticated-user';

@ObjectType('SavedPaymentMethod')
@Authorize({
  authorize: (context: UserContext) =>
    ({
      driverId: { eq: context.req.user.id },
    }) as unknown,
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
  driverId?: number;
}
