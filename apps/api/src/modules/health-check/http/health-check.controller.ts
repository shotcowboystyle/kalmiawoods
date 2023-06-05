import { PrismaService } from '@kalmiawoods/database';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  MemoryHealthIndicator,
  HealthCheckService as TerminusHealthCheckService,
} from '@nestjs/terminus';

import { HealthCheckService } from '../services//health-check.service';
import { PrismaHealthIndicator } from '../services/prisma.health-check.service';

@Controller({
  path: 'health',
})
@ApiTags('Server Health')
export class HealthCheckController {
  constructor(
    private readonly health: TerminusHealthCheckService,
    private readonly healthCheckService: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('ping')
  @ApiOperation({ description: 'Ping the server', operationId: 'Ping' })
  @ApiOkResponse({
    description: 'Server up and running',
  })
  ping() {
    return this.healthCheckService.ping();
  }

  @Get()
  @HealthCheck()
  healthCheck() {
    const prismaSettings = {
      connection: this.prismaService,
      provider: 'postgresql',
      timeout: 5000,
    };

    // Check Services connection
    return this.health.check([
      // The process should not use more than 150MB memory
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Check DB connection
      () => this.prisma.pingCheck('Database', prismaSettings),
    ]);
  }
}
