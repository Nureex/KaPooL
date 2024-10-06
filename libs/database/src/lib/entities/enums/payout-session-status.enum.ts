import { registerEnumType } from '@nestjs/graphql';

export enum PayoutSessionStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

registerEnumType(PayoutSessionStatus, {
  name: 'PayoutSessionStatus',
  description: undefined,
});
