import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizRepository } from '../../../domain/ports/quiz.repository';
import { LoggerService } from '../../../../shared/logs/logger.service';

@Injectable()
export class DeleteQuizUseCase {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(id: string): Promise<void> {
    // Check if quiz exists
    const existingQuiz = await this.quizRepository.findById(id);
    if (!existingQuiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    // Soft delete quiz from database
    await this.quizRepository.softDelete(id);
    this.loggerService.log(`✅ Quiz deleted successfully: ${id}`, 'DeleteQuizUseCase');
  }
}
