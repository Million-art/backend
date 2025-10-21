import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../../domain/ports/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { CreateUserApplicationRequest } from '../../interfaces/user.application.interface';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(request: CreateUserApplicationRequest): Promise<UserEntity> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByTelegramId(request.telegramId);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user entity
    const user = UserEntity.create(
      request.telegramId,
      request.username,
      request.firstName,
      request.lastName,
      request.referredBy,
    );

    // Save user
    return await this.userRepository.save(user);
  }
}
