import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RiderEntity } from '@ridy/database/rider-entity';
import { SharedRiderService } from '@ridy/order/shared-rider.service';
import { AuthRedisService, VerifyHash } from '@ridy/redis/auth-redis.service';
import { auth } from 'firebase-admin';
import { SMSService } from '@ridy/sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private riderService: SharedRiderService,
    private jwtService: JwtService,
    private smsService: SMSService,
    private authRedisService: AuthRedisService,
  ) {}

  async validateUser(firebaseToken: string): Promise<RiderEntity> {
    const decodedToken = await auth().verifyIdToken(firebaseToken);
    const number = (
      decodedToken.firebase.identities.phone[0] as string
    ).substring(1);
    const user = await this.riderService.findOrCreateUserWithMobileNumber({
      mobileNumber: number,
    });
    return user;
  }

  async loginUser(user: RiderEntity): Promise<TokenObject> {
    const payload = { id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async sendVerificationCode(input: {
    phoneNumber: string;
    countryIso?: string;
  }): Promise<{ hash: string }> {
    const code = process.env.DEMO_MODE
      ? '123456'
      : await this.smsService.sendVerificationCodeSms(input.phoneNumber);
    const hash = await this.authRedisService.createVerificationCode({
      mobileNumber: input.phoneNumber,
      countryIso: input.countryIso,
      code,
    });
    return hash;
  }

  async verifyCode(hash: string, code: string): Promise<VerifyHash> {
    const verifyHash = await this.authRedisService.isVerificationCodeValid(
      hash,
      code,
    );
    await this.authRedisService.deleteVerificationCode(hash);
    return verifyHash;
  }

  async setPassword(input: {
    riderId: number;
    password: string;
  }): Promise<RiderEntity> {
    await this.riderService.repo.update(input.riderId, {
      password: input.password,
    });
    return this.riderService.repo.findOneBy({ id: input.riderId });
  }
}

export type TokenObject = { token: string };
