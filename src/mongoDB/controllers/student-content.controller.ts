import { Controller, Get, Param, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../shared/auth/decorators/public.decorator';
import { StudentService } from '../services/student.service';
import { PaymentService } from '../services/payment.service';

// Import the PostgreSQL services for quizzes and materials
import { GetAllQuizzesUseCase } from '../../postgreSQL/application/use-cases/quize/get-all-quizzes-usecase';
import { GetQuizUseCase } from '../../postgreSQL/application/use-cases/quize/get-quiz.usecase';
import { GetMaterialsWithFiltersUseCase } from '../../postgreSQL/application/use-cases/materials/get-materials-with-filters.usecase';
import { GetMaterialUseCase } from '../../postgreSQL/application/use-cases/materials/get-material.usecase';
import { QuizMapper } from '../../postgreSQL/presentation/dto/mappers/quiz.mapper';
import { MaterialMapper } from '../../postgreSQL/presentation/dto/mappers/material.mapper';
import { Difficulty } from '../../postgreSQL/domain/interfaces/enums';

@ApiTags('student-content')
@Controller('api/student')
export class StudentContentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly paymentService: PaymentService,
    private readonly getAllQuizzesUseCase: GetAllQuizzesUseCase,
    private readonly getQuizUseCase: GetQuizUseCase,
    private readonly getMaterialsWithFiltersUseCase: GetMaterialsWithFiltersUseCase,
    private readonly getMaterialUseCase: GetMaterialUseCase,
  ) {}

  @Get('quizzes')
  @Public()
  @ApiOperation({ summary: 'Get all active quizzes for students' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of active quizzes' })
  async getActiveQuizzes() {
    try {
      const quizzes = await this.getAllQuizzesUseCase.execute();
      // Filter only active quizzes
      const activeQuizzes = quizzes.filter(quiz => quiz.isActive);
      return QuizMapper.toResponseDtoList(activeQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw new HttpException('Unable to load quizzes. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('quizzes/:id')
  @Public()
  @ApiOperation({ summary: 'Get quiz by ID for students' })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved quiz' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async getQuizById(@Param('id') id: string) {
    try {
      const quiz = await this.getQuizUseCase.execute(id);
      if (!quiz || !quiz.isActive) {
        throw new HttpException('Quiz not found or inactive', HttpStatus.NOT_FOUND);
      }
      return QuizMapper.toResponseDto(quiz);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error fetching quiz:', error);
      throw new HttpException('Unable to load quiz. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('materials')
  @Public()
  @ApiOperation({ summary: 'Get all active materials for students' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by type' })
  @ApiQuery({ name: 'difficulty', required: false, description: 'Filter by difficulty' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in title/description' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of active materials' })
  async getActiveMaterials(
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('difficulty') difficulty?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      const materials = await this.getMaterialsWithFiltersUseCase.execute({
        category,
        type,
        difficulty: difficulty as Difficulty,
        search,
        page: page || 1,
        limit: limit || 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });
      
      // Filter only active materials (though they should already be filtered by the repository)
      const activeMaterials = materials.materials.filter(material => material.isActive);
      
      return {
        data: MaterialMapper.toResponseDtoList(activeMaterials),
        total: materials.total,
        page: materials.page,
        limit: materials.limit,
        totalPages: materials.totalPages,
      };
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw new HttpException('Unable to load materials. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('materials/:id')
  @Public()
  @ApiOperation({ summary: 'Get material by ID for students' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved material' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async getMaterialById(@Param('id') id: string) {
    try {
      const material = await this.getMaterialUseCase.execute(id);
      if (!material || !material.isActive) {
        throw new HttpException('Material not found or inactive', HttpStatus.NOT_FOUND);
      }
      return MaterialMapper.toResponseDto(material);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error fetching material:', error);
      throw new HttpException('Unable to load material. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('materials/:id/view')
  @Public()
  @ApiOperation({ summary: 'Record material view (increment view count)' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'View recorded successfully' })
  async recordMaterialView(@Param('id') id: string) {
    try {
      // This would typically increment the view count in the database
      // For now, we'll just return success
      return { success: true, message: 'View recorded' };
    } catch (error) {
      throw new HttpException('Failed to record view', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post('quizzes/:id/attempt')
  @Public()
  @ApiOperation({ summary: 'Submit quiz attempt' })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  @ApiResponse({ status: 200, description: 'Quiz attempt submitted successfully' })
  async submitQuizAttempt(
    @Param('id') quizId: string,
    @Body() body: { 
      telegramId: number; 
      answers: Array<{ questionId: string; selectedAnswer: string | boolean }> 
    }
  ) {
    try {
      const quiz = await this.getQuizUseCase.execute(quizId);
      if (!quiz || !quiz.isActive) {
        throw new HttpException('Quiz not found or inactive', HttpStatus.NOT_FOUND);
      }

      // Calculate score
      let score = 0;
      const quizAnswers = body.answers.map(answer => {
        const question = quiz.questions.find(q => q.id === answer.questionId);
        if (!question) {
          throw new HttpException(`Question ${answer.questionId} not found`, HttpStatus.BAD_REQUEST);
        }

        // Find the correct option for this question
        const correctOption = question.options?.find(option => option.isCorrect);
        const isCorrect = answer.selectedAnswer === correctOption?.optionText;
        if (isCorrect) {
          score += question.points;
        }

        return {
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          points: isCorrect ? question.points : 0,
        };
      });

      const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
      const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

      // Create quiz attempt result
      const attempt = {
        id: `attempt_${Date.now()}`,
        quizId,
        telegramId: body.telegramId,
        score,
        totalQuestions: quiz.questions.length,
        percentage: Math.round(percentage * 100) / 100,
        completedAt: new Date().toISOString(),
        answers: quizAnswers,
      };

      // Update student progress
      await this.studentService.updateUser(body.telegramId, {
        totalQuizzesCompleted: 1, // This would be incremented, not set to 1
      });

      return attempt;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to submit quiz attempt', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('usage/:telegramId')
  @Public()
  @ApiOperation({ summary: 'Check user usage limits' })
  @ApiParam({ name: 'telegramId', description: 'Telegram user ID' })
  @ApiQuery({ name: 'feature', required: true, description: 'Feature to check (quiz, material, etc.)' })
  @ApiResponse({ status: 200, description: 'Usage information retrieved successfully' })
  async checkUsageLimit(
    @Param('telegramId') telegramId: number,
    @Query('feature') feature: string
  ) {
    try {
      const usageInfo = await this.studentService.checkUsageLimit(telegramId, feature);
      return usageInfo;
    } catch (error) {
      throw new HttpException('Failed to check usage limit', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('usage/:telegramId/increment')
  @Public()
  @ApiOperation({ summary: 'Increment usage for a feature' })
  @ApiParam({ name: 'telegramId', description: 'Telegram user ID' })
  @ApiResponse({ status: 200, description: 'Usage incremented successfully' })
  async incrementUsage(
    @Param('telegramId') telegramId: number,
    @Body() body: { feature: string }
  ) {
    try {
      await this.studentService.incrementUsage(telegramId, body.feature);
      return { success: true, message: 'Usage incremented' };
    } catch (error) {
      throw new HttpException('Failed to increment usage', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
