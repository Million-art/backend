import { InjectRepository } from '@nestjs/typeorm';
import { QuizRepository } from '../../domain/ports/quiz.repository';
import { QuizModel, QuestionModel, QuestionOptionModel } from '../models/quiz.model';
import { Repository } from 'typeorm';
import { QuizEntity } from '../../domain/entities/quiz.entity';

export class QuizRepositoryImpl implements QuizRepository {
  constructor(
    @InjectRepository(QuizModel)
    private quizRepository: Repository<QuizModel>,
    @InjectRepository(QuestionModel)
    private questionRepository: Repository<QuestionModel>,
    @InjectRepository(QuestionOptionModel)
    private optionRepository: Repository<QuestionOptionModel>,
  ) {}

  async save(quiz: QuizEntity): Promise<QuizEntity> {
    // Save the quiz first
    const newQuiz = this.quizRepository.create({
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
    });
    const savedQuiz = await this.quizRepository.save(newQuiz);

    // Save questions and options if they exist
    if (quiz.questions && quiz.questions.length > 0) {
      for (const question of quiz.questions) {
        const newQuestion = this.questionRepository.create({
          id: question.id,
          quizId: savedQuiz.id,
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
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        });
        const savedQuestion = await this.questionRepository.save(newQuestion);

        // Save options for this question
        if (question.options && question.options.length > 0) {
          for (const option of question.options) {
            const newOption = this.optionRepository.create({
              id: option.id,
              questionId: savedQuestion.id,
              optionText: option.optionText,
              orderIndex: option.orderIndex,
              isCorrect: option.isCorrect,
              isActive: option.isActive,
              selectionCount: option.selectionCount,
              createdAt: option.createdAt,
              updatedAt: option.updatedAt,
            });
            await this.optionRepository.save(newOption);
          }
        }
      }
    }

    // Return the saved quiz with questions loaded
    const quizWithQuestions = await this.findById(savedQuiz.id);
    return quizWithQuestions || this.mapToEntity(savedQuiz);
  }

  async findById(id: string): Promise<QuizEntity | null> {
    const ormQuiz = await this.quizRepository.findOne({
      where: { id, isActive: true },
      relations: ['questions', 'questions.options'],
    });

    if (!ormQuiz) return null;

    return this.mapToEntity(ormQuiz);
  }

  async findAll(): Promise<QuizEntity[]> {
    const ormQuizzes = await this.quizRepository.find({
      where: { isActive: true },
      relations: ['questions', 'questions.options'],
    });
    return ormQuizzes.map(quiz => this.mapToEntity(quiz));
  }

  async findByCategory(category: string): Promise<QuizEntity[]> {
    const ormQuizzes = await this.quizRepository.find({
      where: { category, isActive: true },
    });
    return ormQuizzes.map(quiz => this.mapToEntity(quiz));
  }

  async findByDifficulty(difficulty: string): Promise<QuizEntity[]> {
    const ormQuizzes = await this.quizRepository.find({
      where: { difficulty: difficulty as any, isActive: true },
    });
    return ormQuizzes.map(quiz => this.mapToEntity(quiz));
  }

  async findActive(): Promise<QuizEntity[]> {
    const ormQuizzes = await this.quizRepository.find({
      where: { isActive: true },
    });
    return ormQuizzes.map(quiz => this.mapToEntity(quiz));
  }

  async softDelete(id: string): Promise<void> {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (quiz) {
      quiz.isActive = false;
      await this.quizRepository.save(quiz);
    }
  }

  private mapToEntity(ormQuiz: QuizModel): QuizEntity {
    return {
      id: ormQuiz.id,
      title: ormQuiz.title,
      description: ormQuiz.description,
      category: ormQuiz.category,
      difficulty: ormQuiz.difficulty,
      durationMinutes: ormQuiz.durationMinutes,
      passingScorePercentage: ormQuiz.passingScorePercentage,
      maxAttempts: ormQuiz.maxAttempts,
      isActive: ormQuiz.isActive,
      isRandomized: ormQuiz.isRandomized,
      showCorrectAnswers: ormQuiz.showCorrectAnswers,
      showExplanations: ormQuiz.showExplanations,
      createdBy: ormQuiz.createdBy,
      lastModifiedBy: ormQuiz.lastModifiedBy,
      createdAt: ormQuiz.createdAt,
      updatedAt: ormQuiz.updatedAt,
      questions: ormQuiz.questions || [],
      attempts: ormQuiz.attempts || [],
    };
  }
}
