import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CacheConfig } from './cache.config';

@Module({
  imports: [
    CacheManagerModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: CacheConfig,
    }),
  ],
  exports: [CacheManagerModule],
})
export class CacheModule {}
