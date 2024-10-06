import { ID, ObjectType } from '@nestjs/graphql';
import { Authorize, IDField } from '@ptc-org/nestjs-query-graphql';
import { SMSProviderType } from '@ridy/database/enums/sms-provider-type.enum';
import { SMSProviderAuthorizer } from '../sms-provider.authorizer';

@ObjectType('SMSProvider', {
  description: 'SMS Provider',
})
@Authorize(SMSProviderAuthorizer)
export class SMSProviderDTO {
  @IDField(() => ID)
  id: number;
  name!: string;
  type!: SMSProviderType;
  isDefault!: boolean;
  accountId?: string;
  authToken?: string;
  fromNumber?: string;
  verificationTemplate?: string;
  smsType?: string;
}
