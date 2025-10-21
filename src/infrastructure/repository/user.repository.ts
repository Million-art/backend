import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../domain/ports/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return this.mapToEntity(savedUser);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.mapToEntity(user) : null;
  }

  async findByTelegramId(telegramId: number): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ telegramId }).exec();
    return user ? this.mapToEntity(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => this.mapToEntity(user));
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.userModel.findByIdAndUpdate(user.id, {
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isPremium: user.isPremium,
      isMarakiPremium: user.isMarakiPremium,
      isBot: user.isBot,
      level: user.level,
      referredBy: user.referredBy,
      referral: user.referral,
      subscriptionTier: user.subscriptionTier,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      paymentMethod: user.paymentMethod,
      dailyTokensUsed: user.dailyTokensUsed,
      monthlyTokensUsed: user.monthlyTokensUsed,
      lastTokenReset: user.lastTokenReset,
      totalQuizzesCompleted: user.totalQuizzesCompleted,
      totalMaterialsAccessed: user.totalMaterialsAccessed,
      totalTimeSpent: user.totalTimeSpent,
      updatedAt: new Date(),
    }, { new: true }).exec();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return this.mapToEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  private mapToEntity(userDoc: UserDocument): UserEntity {
    return new UserEntity(
      (userDoc._id as any).toString(),
      userDoc.telegramId,
      userDoc.username,
      userDoc.firstName,
      userDoc.lastName,
      userDoc.isPremium,
      userDoc.isMarakiPremium,
      userDoc.isBot,
      userDoc.level,
      userDoc.referredBy,
      userDoc.referral,
      userDoc.subscriptionTier as any,
      userDoc.subscriptionExpiresAt,
      userDoc.paymentMethod as any,
      userDoc.dailyTokensUsed,
      userDoc.monthlyTokensUsed,
      userDoc.lastTokenReset,
      userDoc.totalQuizzesCompleted,
      userDoc.totalMaterialsAccessed,
      userDoc.totalTimeSpent,
      (userDoc as any).createdAt,
      (userDoc as any).updatedAt,
    );
  }
}
