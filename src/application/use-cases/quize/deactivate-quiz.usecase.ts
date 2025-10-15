import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizRepository } from '../../../domain/ports/quiz.repository';
import { LoggerService } from '../../../shared/logs/logger.service';

@Injectable()
export class DeactivateQuizUseCase {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(id: string): Promise<QuizEntity> {
    // Find existing quiz
    const existingQuiz = await this.quizRepository.findById(id);
    if (!existingQuiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    // Deactivate quiz using domain entity method
    const deactivatedQuiz = existingQuiz.deactivateQuiz();

    // Save deactivated quiz
    const savedQuiz = await this.quizRepository.save(deactivatedQuiz);
    this.loggerService.log(`✅ Quiz deactivated successfully: ${savedQuiz.id}`, 'DeactivateQuizUseCase');

    return savedQuiz;
  }
}
