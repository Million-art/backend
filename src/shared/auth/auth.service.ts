import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../postgreSQL/domain/ports/user.repository';
import { UserEntity } from '../../postgreSQL/domain/entities/user.entity';
import { Roles } from '../../postgreSQL/domain/interfaces/enums';
import { EmailService } from '../email/email.service';
import { LoginDto, RegisterDto, JwtPayload } from './interfaces/auth.interface';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || !user.isActive || !user.password) {
      return null;
    }

    // Check if password is expired
    if (user.isPasswordExpired()) {
      throw new UnauthorizedException('Password has expired. Please request a new password.');
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Set token expiration based on rememberMe
    const expiresIn = loginDto.rememberMe ? '30d' : '24h';
    const token = this.jwtService.sign(payload, { expiresIn });

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password (in real app)
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user entity
    const user = UserEntity.create(
      registerDto.name,
      registerDto.email,
      registerDto.role || Roles.ADMIN,
    );

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Generate token
    const payload: JwtPayload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };

    const token = this.jwtService.sign(payload);

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(
        savedUser.email,
        savedUser.name
      );
    } catch (error) {
      // Don't throw error - registration should succeed even if email fails
    }

    return {
      access_token: token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        isActive: savedUser.isActive,
      },
    };
  }

  async validateToken(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findById(payload.sub);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  async refreshToken(user: UserEntity) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendInvite(email: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || !user.isActive) {
      return { success: false, error: 'User not found or inactive' };
    }

    // Set invite token on user
    const userWithToken = user.setInviteToken(24);
    
    // Save user with token
    await this.userRepository.save(userWithToken);
    
    // Create invite link
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/set-password?token=${userWithToken.inviteToken}`;

    // Send invite email
    try {
      await this.emailService.sendInviteEmail({
        to: user.email,
        inviteLink,
        userName: user.name,
        expiryHours: 24,
      });
      
      return { success: true, token: userWithToken.inviteToken };
    } catch (error) {
      // Log error for debugging but don't expose details to client
      return { success: false, error: 'Failed to send invite email' };
    }
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || !user.isActive) {
      // Don't reveal if user exists or not for security
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    // Set invite token for password reset
    const userWithToken = user.setInviteToken(24);
    await this.userRepository.save(userWithToken);
    const token = userWithToken.inviteToken;
    
    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password?token=${token}`;

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail({
        to: user.email,
        resetLink,
        userName: user.name,
        expiryHours: 24,
      });
    } catch (error) {
      // Log error for debugging but don't reveal it to user
    }

    return { message: 'If the email exists, a password reset link has been sent.' };
  }

  async confirmPasswordReset(email: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid reset request');
    }

    // Hash the password before setting it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Set new permanent password (no expiry)
    const userWithNewPassword = user.setPassword(hashedPassword, false);
    
    // Save updated user
    await this.userRepository.save(userWithNewPassword);

    return { message: 'Password has been successfully reset. You can now login with your new password.' };
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByToken(token);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Check if token is still valid
    if (!user.isTokenValid()) {
      throw new UnauthorizedException('Reset token has expired. Please request a new password reset link.');
    }

    // Hash the password before setting it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Set new permanent password (no expiry) and clear the reset token
    const userWithNewPassword = user.setPassword(hashedPassword, false).clearInviteToken();
    
    // Save updated user
    await this.userRepository.save(userWithNewPassword);

    return { message: 'Password has been successfully reset. You can now login with your new password.' };
  }

  async setPassword(token: string, newPassword: string): Promise<{ message: string }> {
    if (!token || token.length < 10) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    // Find user by token
    const user = await this.userRepository.findByToken(token);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Check if token is still valid
    if (!user.isTokenValid()) {
      throw new UnauthorizedException('Token has expired');
    }

    try {
      // Hash the password before setting it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Set the new password (permanent, no expiry) and clear the token
      const userWithNewPassword = user.setPassword(hashedPassword, false).clearInviteToken();
      await this.userRepository.save(userWithNewPassword);
      
      return { message: 'Password set successfully! You can now login with your new password.' };
      
    } catch (error) {
      throw new UnauthorizedException('Failed to set password. Please request a new invite link.');
    }
  }

}
