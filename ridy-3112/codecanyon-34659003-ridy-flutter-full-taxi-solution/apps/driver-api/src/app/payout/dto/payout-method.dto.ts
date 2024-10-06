import {
  Field,
  ID,
  MiddlewareContext,
  NextFn,
  ObjectType,
} from '@nestjs/graphql';
import { GatewayLinkMethod } from '@ridy/database/enums/gateway-link-method';
import { PaymentGatewayType } from '@ridy/database/enums/payment-gateway-type.enum';
import { PaymentGatewayDTO } from '../../wallet/dto/payment-gateway.dto';
import { Authorize, IDField, Relation } from '@ptc-org/nestjs-query-graphql';
import { PayoutMethodType } from '@ridy/database/enums/payout-method-type.enum';
import { MediaDTO } from '../../upload/media.dto';

@ObjectType('PayoutMethod')
@Relation('media', () => MediaDTO, { nullable: true })
@Authorize({
  authorize: (context, authorizationContext) => ({
    enabled: true,
  }),
})
export class PayoutMethodDTO {
  @IDField(() => ID)
  id: number;
  enabled: boolean;
  name: string;
  type!: PayoutMethodType;
  @Field(() => GatewayLinkMethod, {
    middleware: [
      async (ctx: MiddlewareContext, next: NextFn) => {
        const type = ctx.source.type;
        return type === PaymentGatewayType.Stripe
          ? GatewayLinkMethod.redirect
          : GatewayLinkMethod.manual;
      },
    ],
  })
  linkMethod!: GatewayLinkMethod;
}
