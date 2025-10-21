import { Injectable, Inject } from '@nestjs/common';
import type { QuizRepository } from '../../../domain/ports/quiz.repository';
import { QuizEntity, QuizAttemptEntity, QuestionAttemptEntity } from '../../../domain/entities/quiz.entity';
import { BusinessException, ErrorCode } from '../../../shared/exceptions/business.exception';

@Injectable()
export class SubmitQuizAttemptUseCase {
  constructor(
    @Inject('QuizRepository')
    private readonly quizRepository: QuizRepository
  ) {}

  async execute(quizId: string, userId: string, answers: any[]): Promise<{
    quizId: string;
    attemptId: string;
    userId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    isPassed: boolean;
    answers: any[];
    submittedAt: Date;
  }> {
    if (!quizId || quizId.trim().length === 0) {
      throw BusinessException.validation('Quiz ID is required', {
        field: 'quizId',
        code: ErrorCode.MISSING_REQUIRED_FIELD,
      });
    }

    if (!userId || userId.trim().length === 0) {
      throw BusinessException.validation('User ID is required', {
        field: 'userId',
        code: ErrorCode.MISSING_REQUIRED_FIELD,
      });
    }

    const quiz = await this.quizRepository.findById(quizId);
    
    if (!quiz) {
      throw BusinessException.notFound('Quiz', quizId);
    }

    if (!quiz.isActive) {
      throw BusinessException.validation('Quiz is not active', {
        code: ErrorCode.QUIZ_NOT_ACTIVE,
        value: quizId,
      });
    }

    // Create question attempts from answers
    const questionAttempts: QuestionAttemptEntity[] = answers.map((answer, index) => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (!question) {
        throw BusinessException.notFound('Question', answer.questionId);
      }

      // For now, we'll create a basic attempt structure
      // In a real implementation, you'd validate answers and calculate scores
      const isCorrect = this.validateAnswer(question, answer);
      const pointsEarned = isCorrect ? question.points : 0;

      return new QuestionAttemptEntity(
        crypto.randomUUID(),
        '', // quizAttemptId will be set later
        answer.questionId,
        isCorrect,
        pointsEarned,
        question.points,
        new Date(),
        answer.selectedOptionId,
        answer.textAnswer,
        answer.booleanAnswer,
        answer.timeSpentSeconds,
      );
    });

    // Calculate score
    const totalPoints = quiz.totalPoints;
    const earnedPoints = questionAttempts.reduce((sum, attempt) => sum + attempt.pointsEarned, 0);
    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const isPassed = percentage >= quiz.passingScorePercentage;

    // Create quiz attempt
    const attemptId = crypto.randomUUID();
    const quizAttempt = new QuizAttemptEntity(
      attemptId,
      quizId,
      userId,
      'completed',
      quiz.totalQuestions,
      questionAttempts.length,
      questionAttempts.filter(a => a.isCorrect).length,
      percentage,
      totalPoints,
      earnedPoints,
      isPassed,
      questionAttempts,
      undefined, // userType
      new Date(), // startedAt
      new Date(), // completedAt
      undefined, // timeSpentSeconds
    );

    // Update question attempts with quiz attempt ID
    questionAttempts.forEach(attempt => {
      (attempt as any).quizAttemptId = attemptId;
    });

    return {
      quizId,
      attemptId,
      userId,
      score: earnedPoints,
      totalQuestions: quiz.totalQuestions,
      correctAnswers: questionAttempts.filter(a => a.isCorrect).length,
      percentage,
      isPassed,
      answers,
      submittedAt: new Date(),
    };
  }

  private validateAnswer(question: any, answer: any): boolean {
    // This is a simplified validation
    // In a real implementation, you'd have proper validation logic based on question type
    if (question.questionType === 'multiple_choice') {
      const correctOption = question.options.find((opt: any) => opt.isCorrect);
      return correctOption && correctOption.id === answer.selectedOptionId;
    }
    
    if (question.questionType === 'true_false') {
      // This would need to be stored in the question or answer
      return answer.booleanAnswer === true; // Simplified
    }
    
    if (question.questionType === 'fill_in_blank' || question.questionType === 'short_answer') {
      // This would need proper text matching logic
      return answer.textAnswer && answer.textAnswer.trim().length > 0;
    }
    
    return false;
  }
}
