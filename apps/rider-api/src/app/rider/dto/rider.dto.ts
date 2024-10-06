import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Authorize,
  BeforeFindOne,
  FindOneArgsType,
  IDField,
  OffsetConnection,
  PagingStrategies,
  Relation,
  UnPagedRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Gender } from '@ridy/database/enums/gender.enum';
import { UserContext } from '../../auth/authenticated-user';
import { MediaDTO } from '../../upload/media.dto';
import { CouponDTO } from '../../coupon/dto/coupon.dto';
import { OrderDTO } from '../../order/dto/order.dto';
import { SortDirection } from '@ptc-org/nestjs-query-core';
import { OrderStatus } from '@ridy/database/enums/order-status.enum';
import { RiderDocumentType } from '@ridy/database/enums/rider-document-type';
import { RiderWalletDTO } from '../../wallet/dto/rider-wallet.dto';
import { RiderTransactionDTO } from '../../wallet/dto/rider-transaction.dto';
import { SavedPaymentMethodDto } from '../../wallet/dto/saved-payment-method.dto';
import { DriverDTO } from '../../order/dto/driver.dto';

@ObjectType('Rider')
@Authorize({
  authorize: (context: UserContext) => ({ id: { eq: context.req.user.id } }),
})
@BeforeFindOne((input: FindOneArgsType, context: UserContext) => {
  return { id: context.req.user.id };
})
@Relation('media', () => MediaDTO, {
  nullable: true,
})
@UnPagedRelation('coupons', () => CouponDTO)
@UnPagedRelation('wallets', () => RiderWalletDTO)
@OffsetConnection('transactions', () => RiderTransactionDTO)
@UnPagedRelation('savedPaymentMethods', () => SavedPaymentMethodDto)
@UnPagedRelation('favoriteDrivers', () => DriverDTO, { enableAggregate: true })
@UnPagedRelation('orders', () => OrderDTO, {
  maxResultsSize: 10,
  pagingStrategy: PagingStrategies.NONE,
  defaultFilter: {
    status: {
      in: [
        OrderStatus.Requested,
        OrderStatus.Booked,
        OrderStatus.Found,
        OrderStatus.NotFound,
        OrderStatus.NoCloseFound,
        OrderStatus.DriverAccepted,
        OrderStatus.Arrived,
        OrderStatus.Started,
        OrderStatus.WaitingForReview,
        OrderStatus.WaitingForPostPay,
        OrderStatus.WaitingForPrePay,
      ],
    },
  },
  defaultSort: [{ field: 'id', direction: SortDirection.DESC }],
  defaultResultSize: 1,
  enableAggregate: true,
})
export class RiderDTO {
  @IDField(() => ID)
  id!: number;
  countryIso?: string;
  mobileNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: Gender;
  password?: string;
  isResident?: boolean;
  idNumber?: string;
  @Field(() => Int, { nullable: true })
  presetAvatarNumber?: number;
  documentType?: RiderDocumentType;
}
