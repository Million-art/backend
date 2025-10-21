import { Injectable, Inject } from '@nestjs/common';
import type { QuizRepository } from '../../../domain/ports/quiz.repository';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { BusinessException, ErrorCode } from '../../../shared/exceptions/business.exception';

@Injectable()
export class GetQuizByIdUseCase {
  constructor(
    @Inject('QuizRepository')
    private readonly quizRepository: QuizRepository
  ) {}

  async execute(id: string): Promise<QuizEntity | null> {
    if (!id || id.trim().length === 0) {
      throw BusinessException.validation('Quiz ID is required', {
        field: 'id',
        code: ErrorCode.MISSING_REQUIRED_FIELD,
      });
    }

    return await this.quizRepository.findById(id);
  }
}
