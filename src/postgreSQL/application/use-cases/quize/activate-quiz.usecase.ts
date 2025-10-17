import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizEntity, activateQuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizRepository } from '../../../domain/ports/quiz.repository';
import { LoggerService } from '../../../../shared/logs/logger.service';

@Injectable()
export class ActivateQuizUseCase {
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

    // Activate quiz using domain entity method
    const activatedQuiz = activateQuizEntity(existingQuiz);

    // Save activated quiz
    const savedQuiz = await this.quizRepository.save(activatedQuiz);
    this.loggerService.log(`✅ Quiz activated successfully: ${savedQuiz.id}`, 'ActivateQuizUseCase');

    return savedQuiz;
  }
}
