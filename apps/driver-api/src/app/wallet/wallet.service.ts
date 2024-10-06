import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentGatewayEntity } from '@ridy/database/payment-gateway.entity';
import { Repository } from 'typeorm';
import { PaymentGatewayDTO } from './dto/payment-gateway.dto';
import { PaymentGatewayType } from '@ridy/database/enums/payment-gateway-type.enum';
import { GatewayLinkMethod } from '@ridy/database/enums/gateway-link-method';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(PaymentGatewayEntity)
    private gatewayRepo: Repository<PaymentGatewayEntity>,
  ) {}

  async getGateways(): Promise<PaymentGatewayDTO[]> {
    let result = await this.gatewayRepo.find({
      where: { enabled: true },
    });
    result = result.map((item) => {
      item['linkMethod'] =
        item.type == PaymentGatewayType.Stripe
          ? GatewayLinkMethod.redirect
          : GatewayLinkMethod.none;
      return item;
    });
    return result as unknown as PaymentGatewayDTO[];
  }
}
