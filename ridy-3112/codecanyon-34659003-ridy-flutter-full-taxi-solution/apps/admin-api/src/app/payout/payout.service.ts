import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionEntity } from '@ridy/database/region.entity';
import { MoreThan, Repository } from 'typeorm';
import { DriverTransactionEntity } from '@ridy/database/driver-transaction.entity';
import { DriverWalletEntity } from '@ridy/database/driver-wallet.entity';
import { PayoutSessionStatus } from '@ridy/database/enums/payout-session-status.enum';
import { PayoutSessionEntity } from '@ridy/database/payout-session.entity';
import {
  PayoutMethodStatsDTO,
  PayoutStatisticsDTO,
} from './dto/payout-statistics.dto';
import { CreatePayoutSessionInput } from './dto/create-payout-session.input';
import { TransactionAction } from '@ridy/database/enums/transaction-action.enum';
import { DriverDeductTransactionType } from '@ridy/database/enums/driver-deduct-transaction-type.enum';
import { ForbiddenError } from '@nestjs/apollo';
import { json2csv } from 'json-2-csv';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { ExportSessionToCsvInput } from './dto/export-session-to-csv.input';
import { RunAutoPayoutInput } from './dto/run-auto-payout.input';
import { TransactionStatus } from '@ridy/database/enums/transaction-status.enum';
import { PayoutMethodType } from '@ridy/database/enums/payout-method-type.enum';
import { Stripe } from 'stripe';
import { ManualPayoutInput } from './dto/manual-payout.input';
import { DriverTransactionDTO } from '../driver/dto/driver-transaction.dto';
import { UpdatePayoutSessionInput } from './dto/update-payout-session.input';
import { PayoutMethodEntity } from '@ridy/database/payout-method.entity';

@Injectable()
export class PayoutService {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
    @InjectRepository(PayoutSessionEntity)
    private readonly payoutSessionRepository: Repository<PayoutSessionEntity>,
    @InjectRepository(PayoutMethodEntity)
    private readonly payoutMethodRepository: Repository<PayoutMethodEntity>,
    @InjectRepository(DriverWalletEntity)
    private readonly driverWalletRepository: Repository<DriverWalletEntity>,
    @InjectRepository(DriverTransactionEntity)
    private readonly driverTransactionRepository: Repository<DriverTransactionEntity>,
  ) {}

  async getSupportedCurrencies(): Promise<string[]> {
    const regions = await this.regionRepository.find();
    const currencies = regions.map((region) => region.currency);
    const distinctCurrencies = [...new Set(currencies)];
    return distinctCurrencies;
  }

  async getPayoutStatistics(input: {
    currency?: string;
  }): Promise<PayoutStatisticsDTO> {
    let { currency } = input;
    if (!currency) {
      const currentCurrencies = await this.getSupportedCurrencies();
      currency = currentCurrencies.length > 0 ? currentCurrencies[0] : 'USD';
    }
    const pendingAmount = await this.getPendingAmount(currency);
    const lastPayoutAmount = await this.getLastPayoutAmount(currency);
    const payoutMethodStats = await this.getDriversDefaultPayoutMethodStats(
      currency,
    );
    return {
      pendingAmount,
      lastPayoutAmount,
      currency,
      usersDefaultPayoutMethodStats: payoutMethodStats,
    };
  }

  async getPendingAmount(currency: string): Promise<number> {
    const pendingAmount = await this.driverWalletRepository.find({
      where: { currency, balance: MoreThan(0) },
    });
    const sum = pendingAmount.reduce((a, b) => a + (b.balance || 0), 0);
    return sum || 0;
  }

  async getDriversDefaultPayoutMethodStats(
    currency: string,
  ): Promise<PayoutMethodStatsDTO[]> {
    const driverWallets = await this.driverWalletRepository.find({
      where: { currency, balance: MoreThan(0) },
      relations: ['driver', 'driver.payoutAccounts'],
    });
    const payoutMethods = await this.payoutMethodRepository.find({
      where: { currency },
    });
    const result: PayoutMethodStatsDTO[] = [];
    payoutMethods.forEach((payoutMethod) => {
      const driverWalletsWithPayoutMethod = driverWallets.filter(
        (driverWallet) => {
          if (driverWallet.driver == null) {
            // This drivers have deleted their account
            return false;
          }
          return driverWallet.driver.payoutAccounts.find(
            (account) =>
              account.payoutMethodId === payoutMethod.id && account.isDefault,
          );
        },
      );
      if (driverWalletsWithPayoutMethod.length > 0) {
        result.push({
          payoutMethod,
          totalCount: driverWalletsWithPayoutMethod.length,
        });
      }
    });
    const driversWithoutDefaultPayoutMethod = driverWallets.filter(
      (driverWallet) => {
        if (driverWallet.driver == null) {
          // This drivers have deleted their account
          return false;
        }
        return (
          driverWallet.driver.payoutAccounts.filter(
            (account) => account.isDefault,
          ).length === 0
        );
      },
    );
    if (driversWithoutDefaultPayoutMethod.length > 0) {
      result.push({
        payoutMethod: null,
        totalCount: driversWithoutDefaultPayoutMethod.length,
      });
    }
    return result;
  }

  async getLastPayoutAmount(currency: string): Promise<number> {
    const lastPayout = await this.payoutSessionRepository.findOne({
      where: {
        currency,
        status: PayoutSessionStatus.PAID,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!lastPayout) {
      return 0;
    }
    return lastPayout.totalAmount;
  }

  async createPayoutSession(
    operatorId: number,
    input: CreatePayoutSessionInput,
  ): Promise<PayoutSessionEntity> {
    const driverWallets = await this.driverWalletRepository.find({
      where: {
        currency: input.currency,
        balance: MoreThan(input.minimumAmount),
      },
      relations: ['driver', 'driver.payoutAccounts'],
    });
    if (driverWallets.length === 0) {
      throw new ForbiddenError('No drivers to payout with these filters');
    }
    const session = this.payoutSessionRepository.create({
      createdByOperatorId: operatorId,
      currency: input.currency,
      description: input.description,
      totalAmount: 0,
      payoutMethods: input.payoutMethodIds.map((id) => ({ id })),
    });
    let result = await this.payoutSessionRepository.save(session);
    let totalAmount = 0;
    driverWallets.forEach(async (driverWallet) => {
      const defaultPayoutAccount = driverWallet.driver.payoutAccounts.find(
        (account) => account.isDefault,
      );
      if (defaultPayoutAccount) {
        totalAmount += driverWallet.balance;
        const transaction = this.driverTransactionRepository.create({
          driverId: driverWallet.driver.id,
          amount: driverWallet.balance,
          currency: driverWallet.currency,
          action: TransactionAction.Deduct,
          deductType: DriverDeductTransactionType.Withdraw,
          payoutSessionId: result.id,
          payoutAccountId: defaultPayoutAccount.id,
          payoutMethodId: defaultPayoutAccount.payoutMethodId,
        });
        await this.driverTransactionRepository.save(transaction);
      }
    });
    await this.payoutSessionRepository.update(result.id, { totalAmount });

    return result;
  }

  async exportToCsv(input: ExportSessionToCsvInput): Promise<{ url: string }> {
    const driverTransactions = await this.driverTransactionRepository.find({
      where: {
        payoutSessionId: input.payoutSessionId,
        payoutMethodId: input.payoutMethodId,
        status: TransactionStatus.Processing,
      },
      relations: ['driver', 'payoutAccount', 'payoutMethod'],
    });
    const result: ExportCSV[] = driverTransactions.map((transaction) => {
      return {
        transactionId: transaction.id,
        driverFirstName: transaction.driver.firstName,
        driverLastName: transaction.driver.lastName,
        amount: transaction.amount,
        currency: transaction.currency,
        accountNumber: transaction.payoutAccount.accountNumber,
        routingNumber: transaction.payoutAccount.routingNumber,
        bankName: transaction.payoutAccount.bankName,
        branchName: transaction.payoutAccount.branchName,
        accountHolderName: transaction.payoutAccount.accountHolderName,
        accountHolderCountry: transaction.payoutAccount.accountHolderCountry,
        accountHolderState: transaction.payoutAccount.accountHolderState,
        accountHolderCity: transaction.payoutAccount.accountHolderCity,
        accountHolderAddress: transaction.payoutAccount.accountHolderAddress,
        accountHolderZip: transaction.payoutAccount.accountHolderZip,
      };
    });
    const str = await json2csv(result);
    const fileName = `${new Date().getTime().toString()}.csv`;
    await writeFile(
      join(process.cwd(), 'uploads', `${new Date().getTime().toString()}.csv`),
      str,
    );
    return {
      url: `uploads/${fileName}`,
    };
  }

  async runAutoPayout(input: RunAutoPayoutInput) {
    const driverTransactions = await this.driverTransactionRepository.find({
      where: {
        payoutSessionId: input.payoutSessionId,
        payoutMethodId: input.payoutMethodId,
        status: TransactionStatus.Processing,
      },
      relations: ['driver', 'payoutAccount', 'payoutMethod'],
    });
    for (const transaction of driverTransactions) {
      if (transaction.payoutMethod.type == PayoutMethodType.Stripe) {
        const instance = new Stripe(transaction.payoutMethod.privateKey!, {
          apiVersion: '2022-11-15',
        });
        await instance.transfers.create({
          amount: Math.floor(transaction.amount * 100),
          currency: transaction.currency,
          destination: transaction.payoutAccount.token,
          description: 'Payout',
        });
        this.driverWalletRepository.decrement(
          {
            driverId: transaction.driverId,
            currency: transaction.currency,
          },
          'balance',
          transaction.amount,
        );
        await this.driverTransactionRepository.update(transaction.id, {
          status: TransactionStatus.Done,
        });
      }
    }
  }

  async manualPayout(input: ManualPayoutInput): Promise<DriverTransactionDTO> {
    let driverTransaction = await this.driverTransactionRepository.findOneBy({
      id: input.driverTransactionId,
    });
    this.driverTransactionRepository.update(input.driverTransactionId, {
      refrenceNumber: input.transactionNumber,
      description: input.description,
      status: TransactionStatus.Done,
    });
    this.driverWalletRepository.decrement(
      {
        driverId: driverTransaction.driverId,
        currency: driverTransaction.currency,
      },
      'balance',
      driverTransaction.amount,
    );
    return this.driverTransactionRepository.findOneBy({
      id: input.driverTransactionId,
    });
  }

  async updatePayoutSession(
    id: number,
    update: UpdatePayoutSessionInput,
  ): Promise<PayoutSessionEntity> {
    await this.payoutSessionRepository.update(id, update);
    return this.payoutSessionRepository.findOneBy({ id });
  }
}

class ExportCSV {
  transactionId: number;
  driverFirstName: string;
  driverLastName: string;
  amount: number;
  currency: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  branchName: string;
  accountHolderName: string;
  accountHolderCountry: string;
  accountHolderState: string;
  accountHolderCity: string;
  accountHolderAddress: string;
  accountHolderZip: string;
}
