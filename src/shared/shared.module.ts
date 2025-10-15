import { Module } from '@nestjs/common';
import { LoggerService } from './logs/logger.service';
import { CacheConfigModule } from './cache/cache.module';

@Module({
  imports: [CacheConfigModule],
  providers: [LoggerService],
  exports: [LoggerService, CacheConfigModule],
})
export class SharedModule {}
