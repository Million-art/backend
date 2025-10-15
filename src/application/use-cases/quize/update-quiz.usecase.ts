import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizRepository } from '../../../domain/ports/quiz.repository';
import { UpdateQuizRequest } from '../../interfaces/quiz/update-quiz.interface';
import { LoggerService } from '../../../shared/logs/logger.service';

@Injectable()
export class UpdateQuizUseCase {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: UpdateQuizRequest): Promise<QuizEntity> {
    // Check if quiz exists
    const existingQuiz = await this.quizRepository.findById(request.id);
    if (!existingQuiz) {
      throw new NotFoundException(`Quiz with id ${request.id} not found`);
    }

    // Update the quiz entity
    const updatedQuiz = existingQuiz.updateQuiz(
      request.title,
      request.description,
      request.duration,
      request.totalQuestions,
      request.passingScore,
      request.questions,
      request.category,
      request.difficulty,
    );

    // Save updated quiz to database
    const savedQuiz = await this.quizRepository.save(updatedQuiz);
    this.loggerService.log(`✅ Quiz updated successfully: ${savedQuiz.id}`, 'UpdateQuizUseCase');

    return savedQuiz;
  }
}
