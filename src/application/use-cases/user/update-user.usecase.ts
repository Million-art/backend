import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../../domain/ports/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UpdateUserApplicationRequest } from '../../interfaces/user.application.interface';

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(telegramId: number, request: UpdateUserApplicationRequest): Promise<UserEntity> {
    const user = await this.userRepository.findByTelegramId(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update user entity (immutable updates)
    let updatedUser = user;
    
    if (request.username !== undefined || request.firstName !== undefined || request.lastName !== undefined) {
      updatedUser = updatedUser.updateProfile(request.username, request.firstName, request.lastName);
    }

    return await this.userRepository.update(updatedUser);
  }
}
