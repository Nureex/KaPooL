import { InputType } from '@nestjs/graphql';
import { ServiceOptionIcon } from '@ridy/database/enums/service-option-icon.enum';
import { ServiceOptionType } from '@ridy/database/enums/service-option-type.enum';

@InputType()
export class ServiceOptionInput {
  name: string;
  type: ServiceOptionType;
  additionalFee?: number;
  icon: ServiceOptionIcon;
}
