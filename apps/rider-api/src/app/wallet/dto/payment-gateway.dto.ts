import {
  Authorize,
  BeforeQueryMany,
  FilterableField,
  IDField,
  Relation,
} from '@ptc-org/nestjs-query-graphql';
import {
  Field,
  ID,
  MiddlewareContext,
  NextFn,
  ObjectType,
} from '@nestjs/graphql';
import { PaymentGatewayType } from '@ridy/database/enums/payment-gateway-type.enum';
import { UserContext } from '../../auth/authenticated-user';
import { MediaDTO } from '../../upload/media.dto';
import { GatewayLinkMethod } from '@ridy/database/enums/gateway-link-method';
import { Logger } from '@nestjs/common';

@ObjectType('PaymentGateway')
@BeforeQueryMany((context) => ({
  filter: { enabled: true },
}))
@Relation('media', () => MediaDTO, {
  nullable: true,
})
export class PaymentGatewayDTO {
  @IDField(() => ID)
  id: number;
  @FilterableField(() => Boolean)
  enabled: boolean;
  title: string;
  type: PaymentGatewayType;
  publicKey?: string;
  @Field(() => GatewayLinkMethod, {
    middleware: [
      async (ctx: MiddlewareContext, next: NextFn) => {
        const type = ctx.source.type;
        return type === PaymentGatewayType.Stripe
          ? GatewayLinkMethod.redirect
          : GatewayLinkMethod.none;
      },
    ],
  })
  linkMethod!: GatewayLinkMethod;
}
