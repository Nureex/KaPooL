import { ObjectType } from '@nestjs/graphql';
import { PayoutMethodDTO } from './payout-method.dto';

@ObjectType('PayoutStatistics')
export class PayoutStatisticsDTO {
  pendingAmount: number;
  lastPayoutAmount: number;
  usersDefaultPayoutMethodStats: PayoutMethodStatsDTO[];
  currency: string;
}

@ObjectType('PayoutMethodStats')
export class PayoutMethodStatsDTO {
  payoutMethod?: PayoutMethodDTO;
  totalCount: number;
}
