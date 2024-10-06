import { DynamicModule, Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { existsSync, promises as fs } from 'fs';

import { DriverModule } from '../driver/driver.module';
import { OrderModule } from '../order/order.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SMSModule } from '@ridy/sms/sms.module';
import { RedisHelpersModule } from '@ridy/redis/redis-helper.module';

@Module({})
export class AuthModule {
  static async register(): Promise<DynamicModule> {
    const modules = [
      DriverModule,
      OrderModule,
      PassportModule,
      SMSModule,
      RedisHelpersModule,
      JwtModule.register({
        secret: 'secret_driver',
      }),
    ];
    let providers = [];
    const configAddress = `${process.cwd()}/config/config.${
      process.env.NODE_ENV ?? 'production'
    }.json`;
    if (existsSync(configAddress)) {
      const file = await fs.readFile(configAddress, { encoding: 'utf-8' });
      const config = JSON.parse(file as string);
      if (
        config.firebaseProjectPrivateKey != null &&
        existsSync(
          `${process.cwd()}/config/${config.firebaseProjectPrivateKey}`,
        )
      ) {
        Logger.log('Firebase Auth Module initialized');
        providers = [AuthService, JwtStrategy, AuthResolver];
      }
    }
    return {
      module: AuthModule,
      imports: modules,
      providers: providers,
    };
  }
}
