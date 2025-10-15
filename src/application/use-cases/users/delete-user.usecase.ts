import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.softDelete(id);
  }
}
