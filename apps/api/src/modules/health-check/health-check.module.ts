import { PrismaModule } from '@kalmiawoods/database';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { HealthCheckController } from './http/health-check.controller';
import { HealthCheckService } from './services/health-check.service';
import { PrismaHealthIndicator } from './services/prisma.health-check.service';

@Module({
  imports: [TerminusModule, PrismaModule, RedisHealthModule],
  controllers: [HealthCheckController],
  providers: [HealthCheckService, PrismaHealthIndicator, ConfigService],
})
export class HealthCheckModule {}
