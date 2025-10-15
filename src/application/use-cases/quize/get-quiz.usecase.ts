import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizRepository } from '../../../domain/ports/quiz.repository';

@Injectable()
export class GetQuizUseCase {
  constructor(private readonly quizRepository: QuizRepository) {}

  async execute(id: string): Promise<QuizEntity> {
    const quiz = await this.quizRepository.findById(id);
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }
    return quiz;
  }
}
