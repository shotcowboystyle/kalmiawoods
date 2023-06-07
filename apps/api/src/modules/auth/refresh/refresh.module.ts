import { Module } from '@nestjs/common';

import { CacheModule } from '@/lib';

import { JwtModule } from '../auth.module';
import { RefreshController } from './refresh.controller';
import { RefreshService } from './refresh.service';

@Module({
  imports: [CacheModule, JwtModule],
  providers: [RefreshService, RefreshController],
  controllers: [RefreshController],
  exports: [RefreshService],
})
export class RefreshModule {}
