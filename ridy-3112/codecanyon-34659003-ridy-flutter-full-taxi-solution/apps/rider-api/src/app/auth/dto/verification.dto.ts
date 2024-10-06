import { ObjectType } from '@nestjs/graphql';
import { RiderDTO } from '../../rider/dto/rider.dto';

@ObjectType('VerifcationResult')
export class VerificationDto {
  jwtToken: string;
  user: RiderDTO;
  hasPassword: boolean;
  hasName: boolean;
}
