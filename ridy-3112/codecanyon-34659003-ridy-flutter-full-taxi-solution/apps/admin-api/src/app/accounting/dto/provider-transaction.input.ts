import { Field, ID, InputType } from '@nestjs/graphql';
import { FilterableField, IDField } from '@ptc-org/nestjs-query-graphql';
import { ProviderDeductTransactionType } from '@ridy/database/enums/provider-deduct-transaction-type.enum';
import { ProviderRechargeTransactionType } from '@ridy/database/enums/provider-recharge-transaction-type.enum';
import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';

@InputType()
export class ProviderTransactionInput {
  createdAt!: Date;
  @Field(() => TransactionAction)
  action: TransactionAction;
  @Field(() => ProviderDeductTransactionType)
  deductType?: ProviderDeductTransactionType;
  @Field(() => ProviderRechargeTransactionType)
  rechargeType?: ProviderRechargeTransactionType;
  amount: number;
  currency: string;
  refrenceNumber?: string;
  description?: string;
  @FilterableField(() => ID)
  operatorId?: number;
  @FilterableField(() => ID)
  requestId?: number;
}
