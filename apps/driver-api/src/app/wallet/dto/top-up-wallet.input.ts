import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { PaymentMode } from '@ridy/database/enums/payment-mode.enum';

export enum TopUpWalletStatus {
  OK = 'ok',
  Redirect = 'redirect',
  Failed = 'failed',
}
registerEnumType(TopUpWalletStatus, { name: 'TopUpWalletStatus' });

@InputType()
export class TopUpWalletInput {
  @Field(() => ID)
  gatewayId: number;
  amount: number;
  currency: string;
  token?: string;
  pin?: number;
  otp?: number;
  transactionId?: string;
  @Field(() => PaymentMode, { defaultValue: PaymentMode.PaymentGateway })
  paymentMode: PaymentMode;
}

@ObjectType()
export class TopUpWalletResponse {
  status: TopUpWalletStatus;
  url?: string;
  error?: string;
}
