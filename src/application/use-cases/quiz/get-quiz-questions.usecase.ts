import { Injectable, Inject } from '@nestjs/common';
import type { QuizRepository } from '../../../domain/ports/quiz.repository';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { BusinessException, ErrorCode } from '../../../shared/exceptions/business.exception';

@Injectable()
export class GetQuizQuestionsUseCase {
  constructor(
    @Inject('QuizRepository')
    private readonly quizRepository: QuizRepository
  ) {}

  async execute(quizId: string): Promise<QuizEntity | null> {
    if (!quizId || quizId.trim().length === 0) {
      throw BusinessException.validation('Quiz ID is required', {
        field: 'quizId',
        code: ErrorCode.MISSING_REQUIRED_FIELD,
      });
    }

    const quiz = await this.quizRepository.findById(quizId);
    
    if (!quiz) {
      return null;
    }

    // Return quiz with only active questions
    return {
      ...quiz,
      questions: quiz.activeQuestions,
    } as QuizEntity;
  }
}
