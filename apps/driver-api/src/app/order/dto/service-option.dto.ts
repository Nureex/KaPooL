import { IDField } from '@ptc-org/nestjs-query-graphql';
import { ID, ObjectType } from '@nestjs/graphql';
import { ServiceOptionIcon } from '@ridy/database/enums/service-option-icon.enum';
import { ServiceOptionType } from '@ridy/database/enums/service-option-type.enum';

@ObjectType('ServiceOption')
export class ServiceOptionDTO {
  @IDField(() => ID)
  id: number;
  name: string;
  description?: string;
  type: ServiceOptionType;
  additionalFee?: number;
  icon: ServiceOptionIcon;
}
