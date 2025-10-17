import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { 
  QuizModel, 
  QuestionModel, 
  QuestionOptionModel, 
  QuizAttemptModel, 
  QuestionAttemptModel 
} from './models/quiz.model';
import { MaterialModel } from './models/material.model';
import { UserRepository } from '../domain/ports/user.repository';
import { QuizRepository } from '../domain/ports/quiz.repository';
import { MaterialRepository } from '../domain/ports/material.repository';
import { UserRepositoryImpl } from './repository/user.repository';
import { QuizRepositoryImpl } from './repository/quiz.repository';
import { MaterialRepositoryImpl } from './repository/material.repository';

@Module({
  imports: [TypeOrmModule.forFeature([
    UserModel, 
    QuizModel, 
    QuestionModel, 
    QuestionOptionModel, 
    QuizAttemptModel, 
    QuestionAttemptModel,
    MaterialModel
  ])],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: QuizRepository,
      useClass: QuizRepositoryImpl,
    },
    {
      provide: 'MaterialRepository',
      useClass: MaterialRepositoryImpl,
    },
    
  ],
  exports: [UserRepository, QuizRepository, 'MaterialRepository'],
})
export class InfrastructureModule {}
