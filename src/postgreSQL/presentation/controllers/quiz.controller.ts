import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateQuizUseCase } from '../../application/use-cases/quize/create-quiz.usecase';
import { GetAllQuizzesUseCase } from '../../application/use-cases/quize/get-all-quizzes-usecase';
import { GetQuizUseCase } from '../../application/use-cases/quize/get-quiz.usecase';
import { UpdateQuizUseCase } from '../../application/use-cases/quize/update-quiz.usecase';
import { DeleteQuizUseCase } from '../../application/use-cases/quize/delete-quiz.usecase';
import { ActivateQuizUseCase } from '../../application/use-cases/quize/activate-quiz.usecase';
import { DeactivateQuizUseCase } from '../../application/use-cases/quize/deactivate-quiz.usecase';
import { CreateQuizDto } from '../dto/quiz/create-quiz.dto';
import { UpdateQuizDto } from '../dto/quiz/update-quiz.dto';
import { QuizMapper } from '../dto/mappers/quiz.mapper';
import { QuizResponseDto } from '../dto/quiz/quiz-response.dto';
import { JwtAuthGuard } from '../../../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/auth/guards/roles.guard';
import { RequireRoles } from '../../../shared/auth/decorators/roles.decorator';
import { Roles } from '../../domain/interfaces/enums';

@ApiTags('quizzes')
@Controller('quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class QuizController {
  constructor(
    private readonly createQuizUseCase: CreateQuizUseCase,
    private readonly getQuizUseCase: GetQuizUseCase,
    private readonly getAllQuizzesUseCase: GetAllQuizzesUseCase,
    private readonly updateQuizUseCase: UpdateQuizUseCase,
    private readonly deleteQuizUseCase: DeleteQuizUseCase,
    private readonly activateQuizUseCase: ActivateQuizUseCase,
    private readonly deactivateQuizUseCase: DeactivateQuizUseCase,
  ) {}

  @Post()
  @RequireRoles(Roles.ADMIN, Roles.MODERATOR, Roles.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Create a new quiz',
    description: 'Creates a new quiz with questions, difficulty level, and configuration. The quiz will be created in draft status and can be activated later.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Quiz created successfully', 
    type: QuizResponseDto,
    headers: {
      'Location': {
        description: 'URL of the created quiz',
        schema: { type: 'string', example: '/quizzes/123e4567-e89b-12d3-a456-426614174000' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid quiz data provided' })
  @ApiResponse({ status: 422, description: 'Validation error - Check request body for validation errors' })
  async create(@Body() dto: CreateQuizDto): Promise<QuizResponseDto> {
    const domainEntity = QuizMapper.toDomainEntity(dto);
    const quiz = await this.createQuizUseCase.execute({
      ...dto,
      questions: domainEntity.questions,
    });
    return QuizMapper.toResponseDto(quiz);
  }

  @Get()
  @RequireRoles(Roles.ADMIN, Roles.MODERATOR, Roles.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Get all quizzes',
    description: 'Retrieves a list of all quizzes in the system. Results are ordered by creation date (newest first).'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved list of quizzes', 
    type: [QuizResponseDto] 
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAll(): Promise<QuizResponseDto[]> {
    const quizzes = await this.getAllQuizzesUseCase.execute();
    return QuizMapper.toResponseDtoList(quizzes);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get quiz by ID',
    description: 'Retrieves a specific quiz by its unique identifier. Returns complete quiz details including questions and configuration.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the quiz',
    example: '123e4567-e89b-12d3-a456-426614174000',
    schema: { type: 'string', format: 'uuid' }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quiz found successfully', 
    type: QuizResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Quiz not found - The specified quiz ID does not exist' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid quiz ID format' 
  })
  async getById(@Param('id') id: string): Promise<QuizResponseDto> {
    const quiz = await this.getQuizUseCase.execute(id);
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }
    return QuizMapper.toResponseDto(quiz);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update quiz by ID',
    description: 'Updates an existing quiz with new data. All fields are optional - only provided fields will be updated.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the quiz to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
    schema: { type: 'string', format: 'uuid' }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quiz updated successfully', 
    type: QuizResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Quiz not found - The specified quiz ID does not exist' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Validation error - Check request body for validation errors' 
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateQuizDto,
  ): Promise<QuizResponseDto> {
    const quiz = await this.updateQuizUseCase.execute({ 
      id, 
      title: dto.title,
      description: dto.description,
      durationMinutes: dto.durationMinutes,
      passingScorePercentage: dto.passingScorePercentage,
      maxAttempts: dto.maxAttempts,
      category: dto.category,
      difficulty: dto.difficulty,
      isRandomized: dto.isRandomized,
      showCorrectAnswers: dto.showCorrectAnswers,
      showExplanations: dto.showExplanations,
      // Skip questions for now - they need separate handling
    });
    return QuizMapper.toResponseDto(quiz);
  }

  @Patch(':id/activate')
  @ApiOperation({ 
    summary: 'Activate quiz by ID',
    description: 'Activates a quiz, making it available for use. Only inactive quizzes can be activated.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the quiz to activate',
    example: '123e4567-e89b-12d3-a456-426614174000',
    schema: { type: 'string', format: 'uuid' }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quiz activated successfully', 
    type: QuizResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Quiz not found - The specified quiz ID does not exist' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Quiz is already active' 
  })
  async activate(@Param('id') id: string): Promise<QuizResponseDto> {
    const quiz = await this.activateQuizUseCase.execute(id);
    return QuizMapper.toResponseDto(quiz);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ 
    summary: 'Deactivate quiz by ID',
    description: 'Deactivates a quiz, making it unavailable for use. Only active quizzes can be deactivated.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the quiz to deactivate',
    example: '123e4567-e89b-12d3-a456-426614174000',
    schema: { type: 'string', format: 'uuid' }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quiz deactivated successfully', 
    type: QuizResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Quiz not found - The specified quiz ID does not exist' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Quiz is already inactive' 
  })
  async deactivate(@Param('id') id: string): Promise<QuizResponseDto> {
    const quiz = await this.deactivateQuizUseCase.execute(id);
    return QuizMapper.toResponseDto(quiz);
  }

  @Delete(':id')
  @RequireRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Delete quiz by ID',
    description: 'Permanently deletes a quiz from the system. This action cannot be undone.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the quiz to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
    schema: { type: 'string', format: 'uuid' }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quiz deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Quiz not found - The specified quiz ID does not exist' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Failed to delete quiz' 
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteQuizUseCase.execute(id);
  }
}
