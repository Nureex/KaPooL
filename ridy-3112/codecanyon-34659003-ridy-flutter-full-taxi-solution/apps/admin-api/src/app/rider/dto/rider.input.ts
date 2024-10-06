import { InputType } from '@nestjs/graphql';
import { Gender } from '@ridy/database/enums/gender.enum';
import { RiderStatus } from '@ridy/database/enums/rider-status.enum';

@InputType()
export class RiderInput {
  status?: RiderStatus;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  registrationTimestamp?: Date;
  email?: string;
  gender?: Gender;
  isResident?: boolean;
  idNumber?: string;
}
