import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuizResponseDto, QuestionResponseDto } from '../quiz/quiz-response.dto';

export class QuizMapper {
  static toResponseDto(quiz: QuizEntity): QuizResponseDto {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      totalQuestions: quiz.totalQuestions,
      passingScore: quiz.passingScore,
      isActive: quiz.isActive,
      questions: quiz.questions.map(q => this.mapQuestionToDto(q)),
      category: quiz.category,
      difficulty: quiz.difficulty,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }

  static toResponseDtoList(quizzes: QuizEntity[]): QuizResponseDto[] {
    return quizzes.map((quiz) => this.toResponseDto(quiz));
  }

  private static mapQuestionToDto(question: any): QuestionResponseDto {
    return {
      id: question.id,
      question: question.question,
      type: question.type,
      options: question.options,
      correctAnswer: question.correctAnswer,
      points: question.points,
      explanation: question.explanation,
    };
  }
}
