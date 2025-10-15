import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/ports/user.repository';
import { UpdateUserRequest } from '../../interfaces/user/update-user.interface';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: UpdateUserRequest): Promise<UserEntity> {
    const existingUser = await this.userRepository.findById(request.id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    let updatedUser = existingUser;

    if (request.name || request.email) {
      updatedUser = updatedUser.updateProfile(
        request.name || existingUser.name,
        request.email,
      );
    }

    if (request.role && request.role !== existingUser.role) {
      updatedUser = updatedUser.changeRole(request.role);
    }

    return await this.userRepository.save(updatedUser);
  }
}
