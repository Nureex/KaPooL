import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Args, CONTEXT, Mutation, Resolver, Query, ID } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentGatewayEntity } from '@ridy/database/payment-gateway.entity';
import { Repository } from 'typeorm';

import { UserContext } from '../auth/authenticated-user';
import { GqlAuthGuard } from '../auth/jwt-gql-auth.guard';
import {
  IntentResultToTopUpWalletStatus,
  TopUpWalletInput,
  TopUpWalletResponse,
} from './dto/top-up-wallet.input';
import { SavedPaymentMethodDto } from 'apps/rider-api/src/app/wallet/dto/saved-payment-method.dto';
import { CryptoService } from '@ridy/database';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WalletService } from './wallet.service';
import { SavedPaymentMethodEntity } from '@ridy/database/saved-payment-method.entity';
import {
  IntentResult,
  SetupSavedPaymentMethodDecryptedBody,
} from '@ridy/payment';
import { SetupPaymentMethodDto } from './dto/setup_payment_method.dto';
import { GiftCardDTO } from './dto/gift-card.dto';
import { CommonGiftCardService } from '@ridy/coupon';

@UseGuards(GqlAuthGuard)
@Resolver()
export class WalletResolver {
  constructor(
    @InjectRepository(PaymentGatewayEntity)
    private gatewayRepo: Repository<PaymentGatewayEntity>,
    @InjectRepository(SavedPaymentMethodEntity)
    private savedPaymentMethodRepo: Repository<SavedPaymentMethodEntity>,
    private cryptoService: CryptoService,
    private commongGiftCardService: CommonGiftCardService,
    @Inject(CONTEXT) private context: UserContext,
    private httpService: HttpService,
    private walletService: WalletService,
  ) {}

  @Mutation(() => TopUpWalletResponse)
  async topUpWallet(
    @Args('input', { type: () => TopUpWalletInput }) input: TopUpWalletInput,
    @Args('shouldPreauth', { type: () => Boolean, nullable: true })
    shouldPreauth: boolean,
  ): Promise<TopUpWalletResponse> {
    const paymentLink = await this.walletService.getPaymentLink({
      paymentMode: input.paymentMode,
      gatewayId: input.gatewayId,
      userId: this.context.req.user.id,
      amount: input.amount,
      currency: input.currency,
      orderNumber: input.orderNumber,
      shouldPreauth,
    });
    Logger.log(JSON.stringify(paymentLink), 'paymentLink');
    return {
      status: IntentResultToTopUpWalletStatus(paymentLink.status),
      url: paymentLink.url,
    };
  }

  // @Query(() => [SavedPaymentMethodDto])
  // async savedPaymentMethods(): Promise<SavedPaymentMethodDto[]> {
  //   const result = await this.savedPaymentMethodRepo.find({
  //     where: { riderId: this.context.req.user.id },
  //   });
  //   return result;
  // }

  // @Query(() => [PaymentGatewayDTO])
  // async savableGateways(): Promise<PaymentGatewayDTO[]> {
  //   const result = await this.gatewayRepo.find({
  //     where: { type: In([PaymentGatewayType.Stripe]) },
  //   });
  //   return result;
  // }

  @Mutation(() => SetupPaymentMethodDto)
  async setupPaymentMethod(
    @Args('gatewayId', { type: () => ID }) gatewayId: number,
  ): Promise<SetupPaymentMethodDto> {
    const obj: SetupSavedPaymentMethodDecryptedBody = {
      gatewayId: gatewayId.toString(),
      userType: 'rider',
      currency: 'usd', //TODO: get from user
      userId: this.context.req.user.id.toString(),
      returnUrl: `${
        process.env.RIDER_APPLICATION_ID ?? 'default.rider.redirection'
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
    Logger.log(JSON.stringify(result.data), 'setupPaymentMethod');
    return result.data;
  }

  @Mutation(() => GiftCardDTO)
  async redeemGiftCard(
    @Args('code', { type: () => String }) code: string,
  ): Promise<GiftCardDTO> {
    return this.commongGiftCardService.redeemGiftCard({
      code,
      userId: this.context.req.user.id,
      userType: 'rider',
    });
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
    }) as unknown as SavedPaymentMethodDto[];
  }

  // @Query(() => [PaymentGatewayDTO])
  // async paymentGateways(): Promise<PaymentGatewayDTO[]> {
  //   let result = await this.gatewayRepo.find({
  //     where: { enabled: true },
  //   });
  //   result = result.map((item) => {
  //     item['linkMethod'] =
  //       item.type == PaymentGatewayType.Stripe
  //         ? GatewayLinkMethod.redirect
  //         : GatewayLinkMethod.none;
  //     return item;
  //   });
  //   Logger.log(JSON.stringify(result), 'paymentGateways');

  //   return result as unknown as PaymentGatewayDTO[];
  // }
}
