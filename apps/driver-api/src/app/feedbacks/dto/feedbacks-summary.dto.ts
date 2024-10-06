import { ObjectType } from '@nestjs/graphql';
import { ReviewEntity } from './review.dto';

@ObjectType('FeedbacksSummary')
export class FeedbacksSummaryDTO {
  averageRating?: number;
  goodPoints: string[];
  badPoints: string[];
  goodReviews: ReviewEntity[];
}
