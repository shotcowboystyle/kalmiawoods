import { INestApplication, Inject, Injectable, OnModuleDestroy, OnModuleInit, Optional } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Prisma, PrismaClient } from '../../prisma/client';
import { PrismaServiceOptions } from './interfaces';
import { PRISMA_SERVICE_OPTIONS } from './prisma.constants';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Optional()
    @Inject(PRISMA_SERVICE_OPTIONS)
    private readonly prismaServiceOptions: PrismaServiceOptions = {},
    private readonly logger: PinoLogger,
  ) {
    super(prismaServiceOptions.prismaOptions);
    this.logger.setContext('PrismaService');
  }

  async onModuleInit(): Promise<void> {
    this.$on('query', (e) => {
      this.logger.info('Query: ' + e.query);
      this.logger.info('Params: ' + e.params);
      this.logger.info('Duration: ' + e.duration + 'ms');
    });

    if (this.prismaServiceOptions.explicitConnect) {
      await this.$connect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.info(`Disconnected from database 👋`);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async (event) => {
      this.logger.info(event.name);
      await app.close();
    });
  }
}
