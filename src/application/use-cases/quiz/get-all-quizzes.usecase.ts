import { Injectable, Inject } from '@nestjs/common';
import type { QuizRepository } from '../../../domain/ports/quiz.repository';
import { QuizEntity } from '../../../domain/entities/quiz.entity';

@Injectable()
export class GetAllQuizzesUseCase {
  constructor(
    @Inject('QuizRepository')
    private readonly quizRepository: QuizRepository
  ) {}

  async execute(filters?: {
    category?: string;
    difficulty?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ quizzes: QuizEntity[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    
    const result = await this.quizRepository.findAll({
      ...filters,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      quizzes: result.quizzes,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
