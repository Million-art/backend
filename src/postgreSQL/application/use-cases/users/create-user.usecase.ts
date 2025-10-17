import { Injectable, ConflictException } from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/ports/user.repository';
import { CreateUserRequest } from '../../interfaces/user/create-user.interface';
import { LoggerService } from '../../../../shared/logs/logger.service';
import { EmailService } from '../../../../shared/email/email.service';
 
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
    private readonly emailService: EmailService,
   ) {}

  async execute(request: CreateUserRequest, adminName: string = 'System Administrator'): Promise<UserEntity> {
    //  Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      this.loggerService.warn('User already exists', 'CreateUserUseCase');
      throw new ConflictException('User already exists');
    }

    //  Create a new domain entity (no password initially)
    const newUser = UserEntity.create(
      request.name,
      request.email,
      request.role,
    );

    //  Set invite token on the user entity before saving
    const userWithToken = newUser.setInviteToken(24);

    //  Save user to database with invite token
    const savedUser = await this.userRepository.save(userWithToken);
    this.loggerService.log(`✅ User created successfully: ${savedUser.id}`, 'CreateUserUseCase');

    // Send invite email
    try {
      const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/set-password?token=${savedUser.inviteToken}`;
      
      await this.emailService.sendInviteEmail({
        to: savedUser.email,
        inviteLink,
        userName: savedUser.name,
        expiryHours: 24,
      });
      this.loggerService.log(`📧 Invite email sent to: ${savedUser.email}`, 'CreateUserUseCase');
    } catch (error) {
      this.loggerService.error(`Failed to send invite email to ${savedUser.email}:`, error, 'CreateUserUseCase');
    }

    // Return saved user (without password)
    return savedUser;
  }

}
