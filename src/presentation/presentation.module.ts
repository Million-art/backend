import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { QuizController } from './controllers/quiz.controller';
import { MaterialController } from './controllers/material.controller';
import { SyncController } from './controllers/sync.controller';
import { ApplicationModule } from '../application/application.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [
    UserController,
    QuizController,
    MaterialController,
    SyncController,
  ],
})
export class PresentationModule {}
