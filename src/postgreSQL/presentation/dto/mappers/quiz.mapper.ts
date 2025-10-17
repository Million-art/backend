import { QuizEntity, QuestionEntity, createQuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizResponseDto, QuestionResponseDto, QuestionOptionResponseDto } from '../quiz/quiz-response.dto';
import { CreateQuizDto, CreateQuestionDto, CreateQuestionOptionDto } from '../quiz/create-quiz.dto';
import { v4 as uuidv4 } from 'uuid';

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
      totalQuestions: quiz.questions.length,
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      questions: quiz.questions.map(q => this.mapQuestionToDto(q)),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }

  static toResponseDtoList(quizzes: QuizEntity[]): QuizResponseDto[] {
    return quizzes.map((quiz) => this.toResponseDto(quiz));
  }

  private static mapQuestionToDto(question: QuestionEntity): QuestionResponseDto {
    return {
      id: question.id,
      questionText: question.questionText,
      explanation: question.explanation,
      questionType: question.questionType,
      difficulty: question.difficulty,
      points: question.points,
      orderIndex: question.orderIndex,
      timeLimitSeconds: question.timeLimitSeconds,
      options: question.options.map(option => this.mapOptionToDto(option)),
      totalAttempts: question.totalAttempts,
      correctAttempts: question.correctAttempts,
      successRate: question.totalAttempts > 0 ? (question.correctAttempts / question.totalAttempts) * 100 : 0,
    };
  }

  private static mapOptionToDto(option: any): QuestionOptionResponseDto {
    return {
      id: option.id,
      optionText: option.optionText,
      orderIndex: option.orderIndex,
      isCorrect: option.isCorrect,
      selectionCount: option.selectionCount,
    };
  }

  static toDomainEntity(dto: CreateQuizDto): QuizEntity {
    const questions: QuestionEntity[] = dto.questions.map((q, index) => ({
      id: uuidv4(), // Generate proper UUID
      quizId: '', // Will be set when quiz is saved
      questionText: q.questionText,
      explanation: q.explanation,
      questionType: q.questionType,
      difficulty: q.difficulty,
      points: q.points,
      orderIndex: q.orderIndex,
      isActive: true,
      isRequired: true,
      timeLimitSeconds: q.timeLimitSeconds,
      totalAttempts: 0,
      correctAttempts: 0,
      averageTimeSeconds: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      options: q.options.map((opt, optIndex) => ({
        id: uuidv4(), // Generate proper UUID
        questionId: '', // Will be set when question is saved
        optionText: opt.optionText,
        orderIndex: opt.orderIndex,
        isCorrect: opt.isCorrect,
        isActive: true,
        selectionCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      attempts: [],
    }));

    return createQuizEntity(
      dto.title,
      dto.durationMinutes,
      dto.passingScorePercentage,
      questions,
      dto.difficulty,
      dto.description,
      dto.category,
    );
  }
}
