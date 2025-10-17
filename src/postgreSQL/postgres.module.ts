import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './infrastructure/monitoring/health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';
import { AuthModule } from '../shared/auth/auth.module';
import { EmailModule } from '../shared/email/email.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { SharedModule } from '../shared/shared.module';
import { AllExceptionsFilter } from '../shared/exceptions/all.exception';
import { LoggerService } from '../shared/logs/logger.service';
import { CloudinaryModule } from '../shared/cloudinary/cloudinary.module';
import { ThrottlerGuard } from '@nestjs/throttler';


@Module({
  imports: [

    // Rate limiting configuration
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: 60000, // 1 minute
          limit: configService.get('NODE_ENV') === 'production' ? 100 : 1000, // 100 requests per minute in production
        },
      ],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isDevelopment = configService.get<string>('NODE_ENV') === 'development';
        
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: isDevelopment, // Only in development
          logging: isDevelopment,
          // Production-ready connection pooling
          extra: {
            max: 20, // Maximum number of connections in the pool
            min: 5,  // Minimum number of connections in the pool
            acquire: 30000, // Maximum time to wait for a connection
            idle: 10000,    // Maximum time a connection can be idle
            evict: 1000,    // Time interval to check for idle connections
          },
          // SSL configuration for production
          ssl: !isDevelopment ? { rejectUnauthorized: false } : false,
        };
      },
    }),

    // Health check
    TerminusModule,
    SharedModule,
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
    AuthModule,
    EmailModule,
    CloudinaryModule,

  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    LoggerService,
  ],
  controllers: [HealthController],
})
export class PostgresModule implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      if (this.dataSource.isInitialized) {
        console.log('✅ Database connection established');
      } else {
        console.error('❌ Database connection failed');
      }
    } catch (err: any) {
      console.error('❌ Database connection error:', err?.message || 'Unknown error');
    }
  }
}
