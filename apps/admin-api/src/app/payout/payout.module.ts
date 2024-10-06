import { Module } from '@nestjs/common';
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { PayoutMethodDTO } from './dto/payout-method.dto';
import { PayoutMethodEntity } from '@ridy/database/payout-method.entity';
import { CreatePayoutMethodInput } from './dto/create-payout-method.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PayoutAccountDTO } from './dto/payout-account.dto';
import { PayoutAccountEntity } from '@ridy/database/payout-account.entity';
import { PayoutSessionDTO } from './dto/payout-session.dto';
import { PayoutSessionEntity } from '@ridy/database/payout-session.entity';
import { PayoutService } from './payout.service';
import { PayoutResolver } from './payout.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from '@ridy/database/region.entity';
import { DriverWalletEntity } from '@ridy/database/driver-wallet.entity';
import { DriverTransactionEntity } from '@ridy/database/driver-transaction.entity';
import { OperatorModule } from '../operator/operator.module';

@Module({
  imports: [
    OperatorModule,
    TypeOrmModule.forFeature([
      RegionEntity,
      PayoutSessionEntity,
      DriverWalletEntity,
      DriverTransactionEntity,
    ]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          PayoutMethodEntity,
          PayoutSessionEntity,
          PayoutAccountEntity,
        ]),
      ],
      resolvers: [
        {
          DTOClass: PayoutMethodDTO,
          EntityClass: PayoutMethodEntity,
          CreateDTOClass: CreatePayoutMethodInput,
          UpdateDTOClass: CreatePayoutMethodInput,
          guards: [JwtAuthGuard],
          create: { many: { disabled: true } },
          update: { many: { disabled: true } },
          delete: { many: { disabled: true } },
          enableTotalCount: true,
          pagingStrategy: PagingStrategies.NONE,
        },
        {
          DTOClass: PayoutAccountDTO,
          EntityClass: PayoutAccountEntity,
          read: { many: { disabled: true } },
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
          guards: [JwtAuthGuard],
        },
        {
          DTOClass: PayoutSessionDTO,
          EntityClass: PayoutSessionEntity,
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
          guards: [JwtAuthGuard],
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
  ],
  providers: [PayoutService, PayoutResolver],
})
export class PayoutModule {}
