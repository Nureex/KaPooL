import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  CONTEXT,
  Mutation,
  Resolver,
  Query,
  GraphQLISODateTime,
  ID,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentGatewayEntity } from '@ridy/database/payment-gateway.entity';
import { Repository } from 'typeorm';
import { UserContext } from '../auth/authenticated-user';
import { GqlAuthGuard } from '../auth/jwt-gql-auth.guard';
import { StatisticsResult, TimeQuery } from './dto/earnings.dto';
import {
  TopUpWalletInput,
  TopUpWalletResponse,
  TopUpWalletStatus,
} from './dto/top-up-wallet.input';
import { EarningsService } from './earnings.service';
import { GiftCardDTO } from './dto/gift-card.dto';
import { CommonGiftCardService } from '@ridy/coupon';
import { SetupPaymentMethodDto } from './dto/setup_payment_method.dto';
import {
  IntentResult,
  SetupSavedPaymentMethodDecryptedBody,
} from '@ridy/payment';
import { firstValueFrom } from 'rxjs';
import { CryptoService } from '@ridy/database';
import { HttpService } from '@nestjs/axios';
import { WalletService } from './wallet.service';
import { SavedPaymentMethodDto } from './dto/saved-payment-method.dto';
import { SavedPaymentMethodEntity } from '@ridy/database/saved-payment-method.entity';

@UseGuards(GqlAuthGuard)
@Resolver()
export class WalletResolver {
  constructor(
    @InjectRepository(PaymentGatewayEntity)
    private gatewayRepo: Repository<PaymentGatewayEntity>,
    @InjectRepository(SavedPaymentMethodEntity)
    private savedPaymentMethodRepo: Repository<SavedPaymentMethodEntity>,
    @Inject(CONTEXT) private context: UserContext,
    private earningsService: EarningsService,
    private commonGiftCardService: CommonGiftCardService,
    private httpService: HttpService,
    private cryptoService: CryptoService,
  ) {}

  @Mutation(() => TopUpWalletResponse)
  async topUpWallet(
    @Args('input', { type: () => TopUpWalletInput }) input: TopUpWalletInput,
  ): Promise<TopUpWalletResponse> {
    const gateway = await this.gatewayRepo.findOneBy({ id: input.gatewayId });
    const params = `userType=driver&userId=${this.context.req.user.id}&paymentGatewayId=${gateway.id}&amount=${input.amount}&currency=${input.currency}&returnUrl=${process.env.DRIVER_SERVER_URL}/payment_result`;
    return {
      status: TopUpWalletStatus.Redirect,
      url: `${process.env.GATEWAY_SERVER_URL}/pay?${params}`,
    };
  }

  @Query(() => StatisticsResult)
  async getStats(
    @Args('timeframe', { type: () => TimeQuery }) timeFrame: TimeQuery,
  ) {
    return this.earningsService.getStats(this.context.req.user.id, timeFrame);
  }

  @Query(() => StatisticsResult)
  async getStatsNew(
    @Args('timeframe', { type: () => TimeQuery }) timeFrame: TimeQuery,
    @Args('startDate', { type: () => GraphQLISODateTime }) startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime }) endDate: Date,
  ) {
    return this.earningsService.getStatsNew({
      driverId: this.context.req.user.id,
      timeFrame,
      startDate,
      endDate,
    });
  }

  @Mutation(() => SetupPaymentMethodDto)
  async setupPaymentMethod(
    @Args('gatewayId', { type: () => ID }) gatewayId: number,
  ): Promise<SetupPaymentMethodDto> {
    const obj: SetupSavedPaymentMethodDecryptedBody = {
      gatewayId: gatewayId.toString(),
      userType: 'driver',
      currency: 'usd',
      userId: this.context.req.user.id.toString(),
      returnUrl: `${
        process.env.DRIVER_APPLICATION_ID ?? 'default.driver.redirection'
      }://`,
    };
    const encrypted = await this.cryptoService.encrypt(JSON.stringify(obj));
    const result = await firstValueFrom(
      this.httpService.post<IntentResult>(
        `${process.env.GATEWAY_SERVER_URL}/setup_saved_payment_method`,
        {
          token: encrypted,
        },
      ),
    );
    return result.data;
  }

  @Mutation(() => [SavedPaymentMethodDto])
  async updatePaymentMethodDefault(
    @Args('id', { type: () => ID }) id: number,
    @Args('isDefault', { type: () => Boolean }) isDefault: boolean,
  ): Promise<SavedPaymentMethodDto[]> {
    if (isDefault) {
      await this.savedPaymentMethodRepo.update(
        { riderId: this.context.req.user.id },
        { isDefault: false },
      );
    }
    await this.savedPaymentMethodRepo.update({ id }, { isDefault });
    return this.savedPaymentMethodRepo.find({
      where: { riderId: this.context.req.user.id },
    });
  }

  @Mutation(() => GiftCardDTO)
  async redeemGiftCard(
    @Args('code', { type: () => String }) code: string,
  ): Promise<GiftCardDTO> {
    return this.commonGiftCardService.redeemGiftCard({
      code,
      userType: 'driver',
      userId: this.context.req.user.id,
    });
  }
}
