import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateConfigInput {
  backendMapsAPIKey?: string;
  adminPanelAPIKey?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromNumber?: string;
  twilioVerificationCodeSMSTemplate?: string;
}
