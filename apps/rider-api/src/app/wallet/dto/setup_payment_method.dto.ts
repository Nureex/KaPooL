import { ObjectType } from '@nestjs/graphql';

@ObjectType('SetupPaymentMethod')
export class SetupPaymentMethodDto {
  url?: string;
}
