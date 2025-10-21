import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpgradeUserDto {
  @ApiProperty({ description: 'Subscription tier', example: 'premium' })
  @IsString()
  subscriptionTier: string;

  @ApiProperty({ description: 'Subscription duration in months', example: 1 })
  @IsNumber()
  subscriptionDuration: number;

  @ApiProperty({ description: 'Payment method', example: 'chapa' })
  @IsString()
  paymentMethod: string;
}
