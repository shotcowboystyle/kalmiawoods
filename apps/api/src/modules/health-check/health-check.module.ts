import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from './health-check.service';

@Module({
  imports: [],
  controllers: [HealthCheckController],
  providers: [HealthCheckService, ConfigService],
})
export class HealthCheckModule {}
