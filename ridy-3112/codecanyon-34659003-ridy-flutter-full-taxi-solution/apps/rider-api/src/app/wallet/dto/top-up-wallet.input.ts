import {
  Args,
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
  orderNumber?: string;
  @Field(() => PaymentMode, { defaultValue: PaymentMode.PaymentGateway })
  paymentMode: PaymentMode;
}

@ObjectType()
export class TopUpWalletResponse {
  status: TopUpWalletStatus;
  error?: string;
  url?: string;
}

const TopUpWalletStatusToIntentResultMap: Map<
  TopUpWalletStatus,
  'success' | 'redirect' | 'failed'
> = new Map([
  [TopUpWalletStatus.OK, 'success'],
  [TopUpWalletStatus.Redirect, 'redirect'],
  [TopUpWalletStatus.Failed, 'failed'],
]);

export const TopUpWalletStatusToIntentResult = (
  status: TopUpWalletStatus,
): 'success' | 'redirect' | 'failed' => {
  return TopUpWalletStatusToIntentResultMap.get(status)!;
};

const IntentResultToTopUpWalletStatusMap: Map<
  'success' | 'redirect' | 'failed',
  TopUpWalletStatus
> = new Map([
  ['success', TopUpWalletStatus.OK],
  ['redirect', TopUpWalletStatus.Redirect],
  ['failed', TopUpWalletStatus.Failed],
]);

export const IntentResultToTopUpWalletStatus = (
  status: 'success' | 'redirect' | 'failed',
): TopUpWalletStatus => {
  return IntentResultToTopUpWalletStatusMap.get(status)!;
};
