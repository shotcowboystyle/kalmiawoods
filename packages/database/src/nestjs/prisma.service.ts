import { INestApplication, Inject, Injectable, OnModuleDestroy, OnModuleInit, Optional } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
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

    await this.softDeleteMiddleware();
    await this.filterSoftDeleteMiddleware();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.info(`Disconnected from database 👋`);
  }

  async enableShutdownHooks(app: INestApplication) {
    // this.$on('beforeExit', async (event) => {
    this.$on('beforeExit', async () => {
      // this.logger.info(event.name);
      await app.close();
    });
  }

  /**
   * Middleware to change all DELETE actions for Soft deletes instead
   *
   * @returns Promise<void>
   */
  async softDeleteMiddleware() {
    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = { deletedAt: new Date().toJSON() };
      } else if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['deletedAt'] = new Date().toJSON();
        } else {
          params.args['data'] = { deletedAt: new Date().toJSON() };
        }
      }

      return await next(params);
    });
  }

  /**
   * Middleware to filter all soft deleted records out of responses
   *
   * @returns Promise<void>
   */
  async filterSoftDeleteMiddleware() {
    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      const actions = ['findFirst', 'findMany'];

      if (params.action === 'findUnique') {
        params.action = 'findFirst';
      }

      if (actions.includes(params.action)) {
        // in case deleted records are not explicitly requested
        // return only non soft-deleted records
        if (!params.args.where['deleted']) {
          params.args.where['deletedAt'] = null;
        }

        delete params.args.where['deleted'];
      }

      return await next(params);
    });
  }
}
