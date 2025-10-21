import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/user/create-user.usecase';
import { GetUserUseCase } from '../../application/use-cases/user/get-user.usecase';
import { UpdateUserUseCase } from '../../application/use-cases/user/update-user.usecase';
import { UpgradeUserUseCase } from '../../application/use-cases/user/upgrade-user.usecase';
import { ConsumeTokensUseCase } from '../../application/use-cases/user/consume-tokens.usecase';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UpgradeUserDto } from '../dto/user/upgrade-user.dto';
import { ConsumeTokensDto } from '../dto/user/consume-tokens.dto';
import { UserResponseDto } from '../dto/user/user-response.dto';
import { TokenUsageResponseDto } from '../dto/user/token-usage-response.dto';
import { UserMapper } from '../dto/user/user.mapper';

@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly upgradeUserUseCase: UpgradeUserUseCase,
    private readonly consumeTokensUseCase: ConsumeTokensUseCase,
  ) {}

  // --- Materials (temporary stub endpoints to support mini-app) ---
  @Get('materials')
  @ApiOperation({ summary: 'List available learning materials (stub)' })
  async listMaterials() {
    // Shape matches mini-app expectations: { data, total, page, limit, totalPages }
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }

  @Get('materials/:id')
  @ApiOperation({ summary: 'Get material by ID (stub)' })
  async getMaterialById(@Param('id') id: string) {
    return { id, title: 'Material', content: '', tags: [], status: 'inactive' };
  }

  @Post('materials/:id/view')
  @ApiOperation({ summary: 'Increment material view (stub)' })
  async viewMaterial(@Param('id') id: string) {
    return { id, viewed: true };
  }

  // --- Quizzes (temporary stub endpoints to support mini-app) ---
  @Get('quizzes')
  @ApiOperation({ summary: 'List available quizzes (stub)' })
  async listQuizzes() {
    return [];
  }

  @Get('quizzes/:id')
  @ApiOperation({ summary: 'Get quiz by ID (stub)' })
  async getQuizById(@Param('id') id: string) {
    return { id, title: 'Quiz', questions: [] };
  }

  @Post('quizzes/:id/attempt')
  @ApiOperation({ summary: 'Submit quiz attempt (stub)' })
  async submitQuizAttempt(@Param('id') id: string, @Body() body: any) {
    return { quizId: id, telegramId: body?.telegramId, score: 0, answers: body?.answers ?? [] };
  }

  @Get('telegram/:telegramId')
  @ApiOperation({ summary: 'Get user by Telegram ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  async getStudentByTelegramId(@Param('telegramId') telegramId: number): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.execute(telegramId);
    if (!user) {
      throw new Error('User not found');
    }
    return UserMapper.toResponseDto(user);
  }

  @Post('telegram/:telegramId')
  @ApiOperation({ summary: 'Create or update user' })
  @ApiResponse({ status: 200, description: 'User created/updated', type: UserResponseDto })
  async createOrUpdateUser(
    @Param('telegramId') telegramId: number,
    @Body() userData: CreateUserDto
  ): Promise<UserResponseDto> {
    try {
      const existingUser = await this.getUserUseCase.execute(telegramId);
      if (existingUser) {
        const updatedUser = await this.updateUserUseCase.execute(telegramId, userData);
        return UserMapper.toResponseDto(updatedUser);
      } else {
        const newUser = await this.createUserUseCase.execute({ ...userData, telegramId });
        return UserMapper.toResponseDto(newUser);
      }
    } catch (error) {
      throw new Error(`Error creating/updating user: ${error.message}`);
    }
  }

  @Get(':telegramId/token-check')
  @ApiOperation({ summary: 'Check token limits for request' })
  async checkTokenLimit(
    @Param('telegramId') telegramId: number,
    @Query('estimatedTokens') estimatedTokens: string
  ) {
    return await this.consumeTokensUseCase.checkTokenLimit(telegramId, parseInt(estimatedTokens));
  }

  @Post(':telegramId/tokens/consume')
  @ApiOperation({ summary: 'Consume tokens for request' })
  @ApiResponse({ status: 200, description: 'Tokens consumed', type: UserResponseDto })
  async consumeTokens(
    @Param('telegramId') telegramId: number,
    @Body() body: ConsumeTokensDto
  ): Promise<UserResponseDto> {
    const user = await this.consumeTokensUseCase.execute(telegramId, body.tokensUsed);
    return UserMapper.toResponseDto(user);
  }

  @Post(':telegramId/upgrade')
  @ApiOperation({ summary: 'Upgrade user to premium' })
  @ApiResponse({ status: 200, description: 'User upgraded', type: UserResponseDto })
  async upgradeToPremium(
    @Param('telegramId') telegramId: number,
    @Body() body: UpgradeUserDto
  ): Promise<UserResponseDto> {
    const user = await this.upgradeUserUseCase.execute(
      telegramId,
      body.subscriptionTier,
      body.subscriptionDuration,
      body.paymentMethod
    );
    return UserMapper.toResponseDto(user);
  }

  @Get(':telegramId/usage-status')
  @ApiOperation({ summary: 'Get current token usage status' })
  @ApiResponse({ status: 200, description: 'Token usage status', type: TokenUsageResponseDto })
  async getTokenUsageStatus(@Param('telegramId') telegramId: number): Promise<TokenUsageResponseDto> {
    const user = await this.getUserUseCase.execute(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    return UserMapper.toTokenUsageResponseDto(user);
  }
}
