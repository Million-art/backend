 import { UserEntity } from '../../../domain/entities/user.entity';
import { UserResponseDto } from '../user/user-response.dto';

export class UserMapper {
  static toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseDtoList(users: UserEntity[]): UserResponseDto[] {
    return users.map((user) => this.toResponseDto(user));
  }
}
