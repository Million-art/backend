import { ApiProperty } from '@nestjs/swagger';

export class TokenUsageResponseDto {
  @ApiProperty({ description: 'User subscription tier', example: 'free' })
  tier: string;

  @ApiProperty({ description: 'Daily token usage information' })
  daily: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };

  @ApiProperty({ description: 'Monthly token usage information' })
  monthly: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };

  @ApiProperty({ description: 'Last token reset date' })
  lastReset: Date;
}
