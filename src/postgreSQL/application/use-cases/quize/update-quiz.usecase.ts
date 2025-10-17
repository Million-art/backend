import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizEntity, updateQuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizRepository } from '../../../domain/ports/quiz.repository';
import { UpdateQuizRequest } from '../../interfaces/quiz/update-quiz.interface';
import { LoggerService } from '../../../../shared/logs/logger.service';

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
    const updatedQuiz = updateQuizEntity(existingQuiz, {
      title: request.title,
      description: request.description,
      durationMinutes: request.durationMinutes,
      passingScorePercentage: request.passingScorePercentage,
      maxAttempts: request.maxAttempts,
      // questions: request.questions, // Skip questions for now - they need separate handling
      category: request.category,
      difficulty: request.difficulty,
      isRandomized: request.isRandomized,
      showCorrectAnswers: request.showCorrectAnswers,
      showExplanations: request.showExplanations,
    });

    // Save updated quiz to database
    const savedQuiz = await this.quizRepository.save(updatedQuiz);
    this.loggerService.log(`✅ Quiz updated successfully: ${savedQuiz.id}`, 'UpdateQuizUseCase');

    return savedQuiz;
  }
}