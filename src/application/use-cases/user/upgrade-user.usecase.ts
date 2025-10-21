import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../../domain/ports/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';

@Injectable()
export class UpgradeUserUseCase {
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(
    telegramId: number,
    subscriptionTier: string,
    subscriptionDuration: number,
    paymentMethod: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findByTelegramId(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate expiration date
    const subscriptionExpiresAt = new Date();
    subscriptionExpiresAt.setMonth(subscriptionExpiresAt.getMonth() + subscriptionDuration);

    // Upgrade user (immutable update)
    const updatedUser = user.upgradeToPremium(
      subscriptionTier as any, 
      subscriptionExpiresAt, 
      paymentMethod as any
    );

    return await this.userRepository.update(updatedUser);
  }
}
