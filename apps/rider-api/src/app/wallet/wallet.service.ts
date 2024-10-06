import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMode } from '@ridy/database/enums/payment-mode.enum';
import { PaymentGatewayEntity } from '@ridy/database/payment-gateway.entity';
import { SavedPaymentMethodEntity } from '@ridy/database/saved-payment-method.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ChargeSavedPaymentMethodBody,
  GetPaymentLinkBody,
  IntentResult,
} from '@ridy/payment';
@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(PaymentGatewayEntity)
    private gatewayRepo: Repository<PaymentGatewayEntity>,
    @InjectRepository(SavedPaymentMethodEntity)
    private savedPaymentMethodRepo: Repository<SavedPaymentMethodEntity>,
    private httpService: HttpService,
  ) {}

  async getPaymentLink(input: GetLinkInput): Promise<IntentResult> {
    if (input.paymentMode === PaymentMode.PaymentGateway) {
      let link = await this.getLinkForPaymentGateway(input);
      return link;
    } else if (input.paymentMode == PaymentMode.SavedPaymentMethod) {
      let link = await this.chargeSavedPaymentMethod(input);
      return link;
    }
  }

  private async getLinkForPaymentGateway(
    input: GetLinkInput,
  ): Promise<IntentResult> {
    await this.gatewayRepo.findOneByOrFail({
      id: input.gatewayId,
    });
    let body: GetPaymentLinkBody = {
      userId: input.userId.toString(),
      userType: 'rider',
      paymentGatewayId: input.gatewayId,
      amount: input.amount.toString(),
      currency: input.currency,
      orderNumber: input.orderNumber,
      shouldPreauth: input.shouldPreauth == true ? '1' : '0',
      returnUrl: `${process.env.RIDER_SERVER_URL}/payment_result`,
    };
    let result = await firstValueFrom(
      this.httpService.post<IntentResult>(
        `${process.env.GATEWAY_SERVER_URL}/create_payment_link`,
        body,
      ),
    );

    return {
      status: result.data.status,
      url: result.data.url,
    };
  }

  private async chargeSavedPaymentMethod(
    input: GetLinkInput,
  ): Promise<IntentResult> {
    let savedPaymentMethod = await this.savedPaymentMethodRepo.findOneByOrFail({
      id: input.gatewayId,
    });
    let body: ChargeSavedPaymentMethodBody = {
      userId: input.userId.toString(),
      userType: 'rider',
      savedPaymentMethodId: savedPaymentMethod.id.toString(),
      amount: input.amount,
      currency: input.currency,
      orderNumber: input.orderNumber,
      returnUrl: `${process.env.RIDER_SERVER_URL}/saved_payment_method_charged`,
    };
    let result = await firstValueFrom(
      this.httpService.post<IntentResult>(
        `${process.env.GATEWAY_SERVER_URL}/charge_saved_payment_method`,
        body,
      ),
    );
    return result.data;
  }
}

interface GetLinkInput {
  paymentMode: PaymentMode;
  gatewayId: number;
  userId: number;
  amount: number;
  currency: string;
  orderNumber: string;
  shouldPreauth?: boolean;
}
