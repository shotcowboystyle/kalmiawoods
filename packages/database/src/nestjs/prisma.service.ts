import {
  INestApplication,
  INestMicroservice,
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaServiceOptions } from './interfaces';
import { PRISMA_SERVICE_OPTIONS } from './prisma.constants';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'info' | 'warn' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(
    @Optional()
    @Inject(PRISMA_SERVICE_OPTIONS)
    private readonly prismaServiceOptions: PrismaServiceOptions = {},
  ) {
    super(prismaServiceOptions.prismaOptions);

    if (this.prismaServiceOptions.middlewares) {
      this.prismaServiceOptions.middlewares.forEach((middleware) => this.$use(middleware));
    }
  }

  async onModuleInit() {
    this.$on('query', (event) => {
      this.logger.verbose(event.target);
    });

    if (this.prismaServiceOptions.explicitConnect) {
      await this.$connect();
    }
  }

  async enableShutdownHooks(app: INestApplication | INestMicroservice | NestFastifyApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
