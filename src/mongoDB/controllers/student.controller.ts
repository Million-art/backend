import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentService } from '../services/student.service';

@ApiTags('students')
@Controller('api/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('telegram/:telegramId')
  @ApiOperation({ summary: 'Get student by Telegram ID' })
  async getStudentByTelegramId(@Param('telegramId') telegramId: number) {
    return await this.studentService.findByTelegramId(telegramId);
  }

  @Post('telegram/:telegramId')
  @ApiOperation({ summary: 'Create or update student' })
  async createOrUpdateStudent(
    @Param('telegramId') telegramId: number,
    @Body() userData: any
  ) {
    const existingUser = await this.studentService.findByTelegramId(telegramId);
    if (existingUser) {
      return await this.studentService.updateUser(telegramId, userData);
    } else {
      return await this.studentService.createUser({ telegramId, ...userData });
    }
  }

  @Get(':telegramId/premium-check')
  @ApiOperation({ summary: 'Check premium access for feature' })
  async checkPremiumAccess(
    @Param('telegramId') telegramId: number,
    @Query('feature') feature: string
  ) {
    return await this.studentService.checkUsageLimit(telegramId, feature);
  }

  @Post(':telegramId/usage/increment')
  @ApiOperation({ summary: 'Increment usage for feature' })
  async incrementUsage(
    @Param('telegramId') telegramId: number,
    @Body() body: { feature: string }
  ) {
    return await this.studentService.incrementUsage(telegramId, body.feature);
  }

  @Post(':telegramId/upgrade')
  @ApiOperation({ summary: 'Upgrade student to premium' })
  async upgradeToPremium(
    @Param('telegramId') telegramId: number,
    @Body() body: { 
      method: 'telegram_stars' | 'chapa';
      starsUsed?: number;
      transactionId?: string;
      customerId?: string;
    }
  ) {
    return await this.studentService.upgradeToPremium(telegramId, body);
  }

  @Post(':telegramId/downgrade')
  @ApiOperation({ summary: 'Downgrade student to free' })
  async downgradeToFree(@Param('telegramId') telegramId: number) {
    return await this.studentService.downgradeToFree(telegramId);
  }

  // Telegram Stars Payment Endpoints
  @Post(':telegramId/stars/add')
  @ApiOperation({ summary: 'Add Telegram Stars to user balance' })
  async addTelegramStars(
    @Param('telegramId') telegramId: number, 
    @Body() body: { starsAmount: number }
  ) {
    return await this.studentService.addTelegramStars(telegramId, body.starsAmount);
  }

  @Post(':telegramId/stars/use')
  @ApiOperation({ summary: 'Use Telegram Stars for payment' })
  async useTelegramStars(
    @Param('telegramId') telegramId: number, 
    @Body() body: { starsAmount: number }
  ) {
    return await this.studentService.useTelegramStars(telegramId, body.starsAmount);
  }

  

  // Payment History
  @Get(':telegramId/payment-history')
  @ApiOperation({ summary: 'Get user payment history' })
  async getPaymentHistory(@Param('telegramId') telegramId: number) {
    return await this.studentService.getPaymentHistory(telegramId);
  }

  @Get(':telegramId/progress')
  @ApiOperation({ summary: 'Get student learning progress' })
  async getStudentProgress(@Param('telegramId') telegramId: number) {
    return await this.studentService.getStudentProgress(telegramId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get student statistics' })
  async getStudentStats() {
    return await this.studentService.getStudentStats();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all students' })
  async getAllStudents() {
    return await this.studentService.getAllUsers();
  }

  // Conversation endpoints
  @Get(':telegramId/conversation')
  @ApiOperation({ summary: 'Get student conversation data' })
  async getConversation(@Param('telegramId') telegramId: number) {
    return await this.studentService.getConversation(telegramId);
  }

  @Post(':telegramId/grammar-mistake')
  @ApiOperation({ summary: 'Add grammar mistake' })
  async addGrammarMistake(
    @Param('telegramId') telegramId: number,
    @Body() mistake: any
  ) {
    return await this.studentService.addGrammarMistake(telegramId, mistake);
  }

  @Post(':telegramId/lesson')
  @ApiOperation({ summary: 'Add lesson' })
  async addLesson(
    @Param('telegramId') telegramId: number,
    @Body() lesson: any
  ) {
    return await this.studentService.addLesson(telegramId, lesson);
  }

  @Post(':telegramId/chat-message')
  @ApiOperation({ summary: 'Add chat message' })
  async addChatMessage(
    @Param('telegramId') telegramId: number,
    @Body() chatEntry: any
  ) {
    return await this.studentService.addChatMessage(telegramId, chatEntry);
  }
}
