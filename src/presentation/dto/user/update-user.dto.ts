import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Roles } from '../../../domain/interfaces/enums/user.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Roles)
  role?: Roles;
}