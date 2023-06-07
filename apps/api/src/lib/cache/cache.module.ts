import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CacheConfig } from './cache.config';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheManagerModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: CacheConfig,
    }),
  ],
  providers: [CacheService],
  // exports: [CacheManagerModule, CacheService],
  exports: [CacheService],
})
export class CacheModule {}
