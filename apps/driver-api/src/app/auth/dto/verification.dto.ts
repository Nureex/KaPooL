import { ObjectType } from '@nestjs/graphql';
import { DriverDTO } from '../../driver/dto/driver.dto';

@ObjectType('VerifcationResult')
export class VerificationDto {
  jwtToken: string;
  user: DriverDTO;
  hasPassword: boolean;
  hasName: boolean;
}
