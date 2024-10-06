import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackEntity } from '@ridy/database/feedback.entity';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksResolver } from './feedbacks.resolver';
import { DriverEntity } from '@ridy/database/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity, DriverEntity])],
  providers: [FeedbacksService, FeedbacksResolver],
  exports: [],
})
export class FeedbacksModule {}
