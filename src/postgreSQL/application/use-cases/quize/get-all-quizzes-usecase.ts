import { Injectable } from '@nestjs/common';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizRepository } from '../../../domain/ports/quiz.repository';

@Injectable()
export class GetAllQuizzesUseCase {
  constructor(private readonly quizRepository: QuizRepository) {}

  async execute(): Promise<QuizEntity[]> {
    return await this.quizRepository.findAll();
  }
}
