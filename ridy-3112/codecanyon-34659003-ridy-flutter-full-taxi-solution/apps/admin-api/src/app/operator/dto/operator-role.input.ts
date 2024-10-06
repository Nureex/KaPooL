import { InputType } from '@nestjs/graphql';
import { OperatorPermission } from '@ridy/database/enums/operator-permission.enum';

@InputType()
export class OperatorRoleInput {
  title!: string;
  permissions: OperatorPermission[];
}
