import { ID, ObjectType } from '@nestjs/graphql';
import {
  Authorize,
  FilterableField,
  IDField,
  Relation,
} from '@ptc-org/nestjs-query-graphql';
import { PaymentGatewayDTO } from '../../wallet/dto/payment-gateway.dto';
import { GatewayLinkMethod } from '@ridy/database/enums/gateway-link-method';
import { PayoutMethodDTO } from './payout-method.dto';

@ObjectType('PayoutAccount')
@Relation('paymentGateway', () => PaymentGatewayDTO, {
  nullable: true,
  description: 'Deprecated in favor of payout method relation',
})
@Relation('payoutMethod', () => PayoutMethodDTO)
@Authorize({
  authorize: (context) => ({
    driverId: { eq: context.req.user.id },
  }),
})
export class PayoutAccountDTO {
  @IDField(() => ID)
  id!: number;
  name?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  accountHolderName?: string;
  branchName?: string;
  isDefault!: boolean;
  accountHolderAddress?: string;
  accountHolderCity?: string;
  accountHolderState?: string;
  accountHolderZip?: string;
  accountHolderCountry?: string;
  accountHolderPhone?: string;
  accountHolderDateOfBirth?: Date;
  @FilterableField(() => ID, { filterOnly: true })
  driverId!: number;
  linkType?: GatewayLinkMethod;
}
