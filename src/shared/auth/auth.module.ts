import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '../../postgreSQL/domain/ports/user.repository';
import { UserRepositoryImpl } from '../../postgreSQL/infrastructure/repository/user.repository';
import { UserModel } from '../../postgreSQL/infrastructure/models/user.model';
import { EmailModule } from '../email/email.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserModel]),
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-here',
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
