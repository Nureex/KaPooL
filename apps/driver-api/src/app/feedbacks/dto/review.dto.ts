import { ObjectType } from '@nestjs/graphql';

@ObjectType('Review')
export class ReviewEntity {
  serviceName: string;
  rating: number;
  review: string;
  goodPoints: string[];
}
