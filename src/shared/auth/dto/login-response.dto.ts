import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../../../domain/interfaces/enums/user.enum';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Million',
  })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'million@maraki.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: Roles,
    example: Roles.ADMIN,
  })
  role: Roles;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  isActive: boolean;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserDto,
  })
  user: UserDto;
}
