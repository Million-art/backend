import { Roles } from '../../../domain/interfaces/enums/user.enum';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: Roles;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}