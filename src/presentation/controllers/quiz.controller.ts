import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { QuizResponseDto, QuizListResponseDto } from '../dto/quiz/quiz-response.dto';
import { QuizMapper } from '../dto/quiz/quiz.mapper';
import { GetAllQuizzesUseCase } from '../../application/use-cases/quiz/get-all-quizzes.usecase';
import { GetQuizByIdUseCase } from '../../application/use-cases/quiz/get-quiz-by-id.usecase';
import { GetQuizQuestionsUseCase } from '../../application/use-cases/quiz/get-quiz-questions.usecase';
import { SubmitQuizAttemptUseCase } from '../../application/use-cases/quiz/submit-quiz-attempt.usecase';
import { BusinessException, ErrorCode } from '../../shared/exceptions/business.exception';

@ApiTags('quizzes')
@Controller('api/quizzes')
export class QuizController {
  constructor(
    private readonly getAllQuizzesUseCase: GetAllQuizzesUseCase,
    private readonly getQuizByIdUseCase: GetQuizByIdUseCase,
    private readonly getQuizQuestionsUseCase: GetQuizQuestionsUseCase,
    private readonly submitQuizAttemptUseCase: SubmitQuizAttemptUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiResponse({ status: 200, description: 'List of quizzes', type: QuizListResponseDto })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'difficulty', required: false, description: 'Filter by difficulty' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  async getQuizzes(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
    @Query('isActive') isActive?: string,
  ): Promise<QuizListResponseDto> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    
    const result = await this.getAllQuizzesUseCase.execute({
      category,
      difficulty,
      isActive: isActiveBool,
      page: pageNum,
      limit: limitNum,
    });

    return QuizMapper.toListResponseDto(
      result.quizzes,
      result.total,
      result.page,
      result.limit
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID' })
  @ApiResponse({ status: 200, description: 'Quiz found', type: QuizResponseDto })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async getQuizById(@Param('id') id: string): Promise<QuizResponseDto> {
    const quiz = await this.getQuizByIdUseCase.execute(id);
    
    if (!quiz) {
      throw BusinessException.notFound('Quiz', id);
    }

    return QuizMapper.toResponseDto(quiz);
  }

  @Get(':id/questions')
  @ApiOperation({ summary: 'Get quiz questions' })
  @ApiResponse({ status: 200, description: 'Quiz questions retrieved' })
  async getQuizQuestions(@Param('id') id: string) {
    const quiz = await this.getQuizQuestionsUseCase.execute(id);
    
    if (!quiz) {
      throw BusinessException.notFound('Quiz', id);
    }

    return {
      quizId: id,
      questions: quiz.questions.map(q => QuizMapper.toQuestionResponseDto(q)),
    };
  }

  @Post(':id/attempt')
  @ApiOperation({ summary: 'Submit quiz attempt' })
  @ApiResponse({ status: 200, description: 'Quiz attempt submitted' })
  async submitQuizAttempt(
    @Param('id') id: string,
    @Body() body: any
  ) {
    const userId = body?.userId || body?.telegramId;
    const answers = body?.answers || [];

    if (!userId) {
      throw BusinessException.validation('User ID is required', {
        field: 'userId',
        code: ErrorCode.MISSING_REQUIRED_FIELD,
      });
    }

    return await this.submitQuizAttemptUseCase.execute(id, userId, answers);
  }

  @Get(':id/attempts')
  @ApiOperation({ summary: 'Get quiz attempts for a user' })
  @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
  async getQuizAttempts(
    @Param('id') id: string,
    @Query('userId') userId: string
  ) {
    // TODO: Implement quiz attempts retrieval logic
    // This would require a separate use case for getting user attempts
    // For now, return empty array as placeholder
    
    return {
      quizId: id,
      userId,
      attempts: [],
    };
  }
}
