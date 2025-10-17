import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { QuizController } from './controllers/quiz.controller';
import { MaterialController } from './controllers/material.controller';
import { ApplicationModule } from '../application/application.module';
import { SharedModule } from '../../shared/shared.module';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';

@Module({
    imports:[ApplicationModule, SharedModule, CloudinaryModule],
    controllers:[UserController, QuizController, MaterialController]
})
export class PresentationModule {}
