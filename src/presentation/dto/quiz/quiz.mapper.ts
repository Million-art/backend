import { QuizEntity, QuestionEntity, QuestionOptionEntity } from '../../../domain/entities/quiz.entity';
import { QuizResponseDto, QuestionResponseDto, QuestionOptionResponseDto, QuizListResponseDto } from './quiz-response.dto';

export class QuizMapper {
  static toResponseDto(quiz: QuizEntity): QuizResponseDto {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      durationMinutes: quiz.durationMinutes,
      passingScorePercentage: quiz.passingScorePercentage,
      maxAttempts: quiz.maxAttempts,
      isActive: quiz.isActive,
      isRandomized: quiz.isRandomized,
      showCorrectAnswers: quiz.showCorrectAnswers,
      showExplanations: quiz.showExplanations,
      createdBy: quiz.createdBy,
      lastModifiedBy: quiz.lastModifiedBy,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      questions: quiz.questions.map(question => this.toQuestionResponseDto(question)),
      totalQuestions: quiz.totalQuestions,
      totalPoints: quiz.totalPoints,
      activeQuestions: quiz.activeQuestions.length,
    };
  }

  static toQuestionResponseDto(question: QuestionEntity): QuestionResponseDto {
    return {
      id: question.id,
      quizId: question.quizId,
      questionText: question.questionText,
      explanation: question.explanation,
      questionType: question.questionType,
      difficulty: question.difficulty,
      points: question.points,
      orderIndex: question.orderIndex,
      isActive: question.isActive,
      isRequired: question.isRequired,
      timeLimitSeconds: question.timeLimitSeconds,
      totalAttempts: question.totalAttempts,
      correctAttempts: question.correctAttempts,
      averageTimeSeconds: question.averageTimeSeconds,
      options: question.options.map(option => this.toQuestionOptionResponseDto(option)),
      successRate: question.successRate,
      difficultyLevel: question.difficultyLevel,
    };
  }

  static toQuestionOptionResponseDto(option: QuestionOptionEntity): QuestionOptionResponseDto {
    return {
      id: option.id,
      optionText: option.optionText,
      isCorrect: option.isCorrect,
      orderIndex: option.orderIndex,
      isActive: option.isActive,
      selectionCount: option.selectionCount,
    };
  }

  static toResponseDtoList(quizzes: QuizEntity[]): QuizResponseDto[] {
    return quizzes.map(quiz => this.toResponseDto(quiz));
  }

  static toListResponseDto(
    quizzes: QuizEntity[],
    total: number,
    page: number,
    limit: number
  ): QuizListResponseDto {
    return {
      data: this.toResponseDtoList(quizzes),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
