import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsumeTokensDto {
  @ApiProperty({ description: 'Number of tokens to consume', example: 100 })
  @IsNumber()
  @Min(0)
  tokensUsed: number;
}
