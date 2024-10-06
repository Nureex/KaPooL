import { InputType } from '@nestjs/graphql';
import { Point, TimeMultiplier } from '@ridy/database';

@InputType()
export class ZonePriceInput {
  name!: string;
  from!: Point[][];
  to!: Point[][];
  cost: number;
  timeMultipliers!: TimeMultiplier[];
}
