import { Args, CONTEXT, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PayoutService } from './payout.service';
import { PayoutStatisticsDTO } from './dto/payout-statistics.dto';
import { PayoutSessionDTO } from './dto/payout-session.dto';
import { CreatePayoutSessionInput } from './dto/create-payout-session.input';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserContext } from '../auth/authenticated-admin';
import { ExportSessionToCsvInput } from './dto/export-session-to-csv.input';
import { RunAutoPayoutInput } from './dto/run-auto-payout.input';
import { DriverTransactionDTO } from '../driver/dto/driver-transaction.dto';
import { ManualPayoutInput } from './dto/manual-payout.input';
import { OperatorService } from '../operator/operator.service';
import { OperatorPermission } from '@ridy/database/enums/operator-permission.enum';
import { ForbiddenError } from '@nestjs/apollo';
import { UpdatePayoutSessionInput } from './dto/update-payout-session.input';

@Resolver()
@UseGuards(JwtAuthGuard)
export class PayoutResolver {
  constructor(
    private payoutService: PayoutService,
    private operatorService: OperatorService,
    @Inject(CONTEXT) private context: UserContext,
  ) {}

  @Query(() => [String])
  async supportedCurrencies(): Promise<string[]> {
    return this.payoutService.getSupportedCurrencies();
  }

  @Query(() => PayoutStatisticsDTO)
  async payoutStatistics(
    @Args('currency', { type: () => String, nullable: true }) currency?: string,
  ): Promise<PayoutStatisticsDTO> {
    return this.payoutService.getPayoutStatistics({ currency });
  }

  @Mutation(() => PayoutSessionDTO)
  async createPayoutSession(
    @Args('input', { type: () => CreatePayoutSessionInput })
    input: CreatePayoutSessionInput,
  ) {
    const hasPermission = await this.operatorService.hasPermissionBoolean(
      this.context.req.user.id,
      OperatorPermission.Payouts_Edit,
    );
    if (!hasPermission) {
      throw new ForbiddenError(
        'You do not have permission to perform this action',
      );
    }
    return this.payoutService.createPayoutSession(
      this.context.req.user.id,
      input,
    );
  }

  @Mutation(() => String)
  async exportSessionToCsv(
    @Args('input', { type: () => ExportSessionToCsvInput })
    input: ExportSessionToCsvInput,
  ) {
    const hasPermission = await this.operatorService.hasPermissionBoolean(
      this.context.req.user.id,
      OperatorPermission.Payouts_Edit,
    );
    if (!hasPermission) {
      throw new ForbiddenError(
        'You do not have permission to perform this action',
      );
    }
    const csv = await this.payoutService.exportToCsv(input);
    return csv.url;
  }

  @Mutation(() => Boolean)
  async runAutoPayout(
    @Args('input', { type: () => RunAutoPayoutInput })
    input: RunAutoPayoutInput,
  ): Promise<boolean> {
    const hasPermission = await this.operatorService.hasPermissionBoolean(
      this.context.req.user.id,
      OperatorPermission.Payouts_Edit,
    );
    if (!hasPermission) {
      throw new ForbiddenError(
        'You do not have permission to perform this action',
      );
    }
    await this.payoutService.runAutoPayout(input);
    return true;
  }

  @Mutation(() => DriverTransactionDTO)
  async manualPayout(
    @Args('input', { type: () => ManualPayoutInput }) input: ManualPayoutInput,
  ): Promise<DriverTransactionDTO> {
    const hasPermission = await this.operatorService.hasPermissionBoolean(
      this.context.req.user.id,
      OperatorPermission.Payouts_Edit,
    );
    if (!hasPermission) {
      throw new ForbiddenError(
        'You do not have permission to perform this action',
      );
    }
    return this.payoutService.manualPayout(input);
  }

  @Mutation(() => PayoutSessionDTO)
  async updatePayoutSession(
    @Args('id', { type: () => ID }) id: number,
    @Args('input', { type: () => UpdatePayoutSessionInput })
    input: UpdatePayoutSessionInput,
  ): Promise<PayoutSessionDTO> {
    const hasPermission = await this.operatorService.hasPermissionBoolean(
      this.context.req.user.id,
      OperatorPermission.Payouts_Edit,
    );
    if (!hasPermission) {
      throw new ForbiddenError(
        'You do not have permission to perform this action',
      );
    }
    return this.payoutService.updatePayoutSession(id, input);
  }
}
