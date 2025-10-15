import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { SendInviteDto } from './dto/send-invite.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { UserResponseDto } from '../../presentation/dto/user/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 login attempts per minute
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user and return JWT token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful', 
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials' 
  })
  async login(@Body() loginDto: LoginRequestDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ 
    summary: 'User registration',
    description: 'Register a new user account'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully', 
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User already exists' 
  })
  async register(@Body() registerDto: RegisterRequestDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Get current authenticated user profile'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully', 
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async getProfile(@Request() req) {
    return {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Refresh token',
    description: 'Refresh JWT token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 requests per 5 minutes
  @ApiOperation({ 
    summary: 'Request password reset',
    description: 'Send password reset email with temporary password'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset email sent (if email exists)' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid email format' 
  })
  async forgotPassword(@Body() resetRequestDto: PasswordResetRequestDto) {
    return this.authService.requestPasswordReset(resetRequestDto.email);
  }

  @Post('send-invite')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 requests per 5 minutes
  @ApiOperation({ 
    summary: 'Send invite email',
    description: 'Send invite email to user to set their password'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Invite email sent successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid email format' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async sendInvite(@Body() sendInviteDto: SendInviteDto) {
    return this.authService.sendInvite(sendInviteDto.email);
  }

  @Post('set-password')
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 attempts per 5 minutes
  @ApiOperation({ 
    summary: 'Set password with invite token',
    description: 'Set new password using invite token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password set successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid token or password requirements not met' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid or expired token' 
  })
  async setPassword(@Body() setPasswordDto: SetPasswordDto) {
    return this.authService.setPassword(setPasswordDto.token, setPasswordDto.password);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 attempts per 5 minutes
  @ApiOperation({ 
    summary: 'Confirm password reset',
    description: 'Set new permanent password after using reset link'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid request or password requirements not met' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid reset request' 
  })
  async resetPassword(@Body() resetConfirmDto: PasswordResetConfirmDto & { token: string }) {
    return this.authService.resetPasswordWithToken(resetConfirmDto.token, resetConfirmDto.password);
  }
}
