import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Authorize,
  BeforeFindOne,
  BeforeFindOneHook,
  BeforeUpdateOne,
  FindOneArgsType,
  IDField,
  OffsetConnection,
  Relation,
  UnPagedRelation,
  UpdateOneInputType,
} from '@ptc-org/nestjs-query-graphql';
import { Gender } from '@ridy/database/enums/gender.enum';
import { DriverStatus } from '@ridy/database/enums/driver-status.enum';
import { UserContext } from '../../auth/authenticated-user';
import { CarModelDTO } from './car-model.dto';
import { CarColorDTO } from './car-color.dto';
import { OrderDTO } from '../../order/dto/order.dto';
import { SortDirection } from '@ptc-org/nestjs-query-core';
import { OrderStatus } from '@ridy/database/enums/order-status.enum';
import { MediaDTO } from '../../upload/media.dto';
import { DriverWalletDTO } from '../../wallet/dto/driver-wallet.dto';
import { ServiceDTO } from '../../service/dto/service.dto';
import { Logger } from '@nestjs/common';
import { SavedPaymentMethodDto } from '../../wallet/dto/saved-payment-method.dto';
import { DriverTransactionDTO } from '../../wallet/dto/driver-transaction.dto';

@ObjectType('Driver')
@Authorize({
  authorize: (context: UserContext) => ({ id: { eq: context.req.user.id } }),
})
@BeforeFindOne((input: FindOneArgsType, context: UserContext) => {
  return { id: context.req.user.id };
})
@BeforeUpdateOne((input: UpdateOneInputType<any>, context: UserContext) => {
  return { id: context.req.user.id, update: input.update };
})
@UnPagedRelation('documents', () => MediaDTO, {
  update: { enabled: true },
  nullable: true,
})
@Relation('car', () => CarModelDTO, {
  nullable: true,
})
@Relation('carColor', () => CarColorDTO, {
  nullable: true,
})
@Relation('media', () => MediaDTO, {
  nullable: true,
})
@OffsetConnection('historyOrders', () => OrderDTO, {
  relationName: 'orders',
  enableAggregate: true,
})
@UnPagedRelation('savedPaymentMethods', () => SavedPaymentMethodDto)
@OffsetConnection('orders', () => OrderDTO, {
  maxResultsSize: 1,
  defaultFilter: {
    status: {
      in: [
        OrderStatus.DriverAccepted,
        OrderStatus.Arrived,
        OrderStatus.Started,
        OrderStatus.WaitingForPostPay,
      ],
    },
  },
  defaultSort: [{ field: 'id', direction: SortDirection.DESC }],
  defaultResultSize: 1,
}) // This is essentially same as currentOrders and should be phased out. In most build prior to v2.3.x the chat feature relied on this
@UnPagedRelation('currentOrders', () => OrderDTO, {
  maxResultsSize: 1,
  defaultFilter: {
    status: {
      in: [
        OrderStatus.DriverAccepted,
        OrderStatus.Arrived,
        OrderStatus.Started,
        OrderStatus.WaitingForPostPay,
      ],
    },
  },
  defaultSort: [{ field: 'id', direction: SortDirection.DESC }],
  defaultResultSize: 1,
  relationName: 'orders',
})
@UnPagedRelation('enabledServices', () => ServiceDTO)
@OffsetConnection('transactions', () => DriverTransactionDTO)
@UnPagedRelation('wallet', () => DriverWalletDTO, {
  relationName: 'wallet',
})
export class DriverDTO {
  @IDField(() => ID)
  id!: number;
  firstName?: string;
  lastName?: string;
  mobileNumber: string;
  certificateNumber?: string;
  countryIso?: string;
  email?: string;
  @Field(() => Int)
  carProductionYear?: number;
  carPlate?: string;
  status!: DriverStatus;
  gender?: Gender;
  registrationTimestamp!: Date;
  lastSeenTimestamp?: Date;
  accountNumber?: string;
  bankName?: string;
  bankRoutingNumber?: string;
  bankSwift?: string;
  address?: string;
  @Field(() => Int, { nullable: true })
  presetAvatarNumber?: number;
  softRejectionNote?: string;
  @Field(() => ID)
  carId?: number;
  @Field(() => ID, {
    description:
      'arbitary field to prevent exception. The correct field is carId',
    defaultValue: null,
  })
  carModelId?: number;
  @Field(() => ID)
  carColorId?: number;
  @Field(() => Int)
  searchDistance?: number;
  rating?: number;
  @Field(() => Boolean, {
    middleware: [
      (ctx, next) => {
        if (process.env.HIDDEN_WALLETS == null) return false;
        Logger.log(
          `looking for hidden wallet ${process.env.HIDDEN_WALLETS.split(
            ',',
          ).includes(ctx.context.req.user.id.toString())}`,
        );
        return process.env.HIDDEN_WALLETS.split(',').includes(
          ctx.context.req.user.id.toString(),
        );
      },
    ],
  })
  isWalletHidden: boolean;
}
