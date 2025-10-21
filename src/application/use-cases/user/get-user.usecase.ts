import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../../domain/ports/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';

@Injectable()
export class GetUserUseCase {
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(telegramId: number): Promise<UserEntity | null> {
    return await this.userRepository.findByTelegramId(telegramId);
  }

  async executeById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findById(id);
  }
}
