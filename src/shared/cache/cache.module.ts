import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          ttl: 300, // 5 minutes default TTL
        };

        // In development, use memory store if Redis is not available
        if (configService.get('NODE_ENV') === 'development') {
          return {
            ttl: 300,
            max: 100, // Maximum number of items in cache
          };
        }

        // In production, use Redis
        return {
          store: redisStore,
          ...redisConfig,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  exports: [CacheModule],
})
export class CacheConfigModule {}
