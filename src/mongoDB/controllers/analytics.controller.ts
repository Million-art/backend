import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/guards/roles.guard';
import { RequireRoles } from '../../shared/auth/decorators/roles.decorator';
import { Roles } from '../../postgreSQL/domain/interfaces/enums/user.enum';
import { AnalyticsService } from '../services/analytics.service';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('telegram-users')
  @RequireRoles(Roles.ADMIN, Roles.SUPERADMIN)
  async getTelegramUserAnalytics() {
    return this.analyticsService.getTelegramUserAnalytics();
  }

  @Get('telegram-users/summary')
  @RequireRoles(Roles.ADMIN, Roles.SUPERADMIN)
  async getTelegramUserSummary() {
    return this.analyticsService.getTelegramUserSummary();
  }
}
