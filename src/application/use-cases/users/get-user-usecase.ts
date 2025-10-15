// src/application/use-cases/get-user.usecase.ts
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/ports/user.repository';

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findById(id);
  }
}
