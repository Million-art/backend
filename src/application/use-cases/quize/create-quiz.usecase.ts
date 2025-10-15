import { Injectable, ConflictException } from '@nestjs/common';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizRepository } from '../../../domain/ports/quiz.repository';
import { CreateQuizRequest } from '../../interfaces/quiz/create-quiz.interface';
import { LoggerService } from '../../../shared/logs/logger.service';

@Injectable()
export class CreateQuizUseCase {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: CreateQuizRequest): Promise<QuizEntity> {
    // Create a new domain entity
    const newQuiz = QuizEntity.create(
      request.title,
      request.duration,
      request.totalQuestions,
      request.passingScore,
      request.questions,
      request.difficulty,
      request.description,
      request.category,
    );

    // Save quiz to database
    const savedQuiz = await this.quizRepository.save(newQuiz);
    this.loggerService.log(`✅ Quiz created successfully: ${savedQuiz.id}`, 'CreateQuizUseCase');

    // Return saved quiz
    return savedQuiz;
  }
}
