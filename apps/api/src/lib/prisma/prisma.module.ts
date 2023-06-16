import { PrismaModule, PrismaServiceOptions } from '@kalmiawoods/database';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: <PrismaServiceOptions>{
        log: ['query', 'info', 'warn', 'error'],
        // middlewares: [
        //   loggingMiddleware(),
        //   softDeleteMiddleware(),
        //   filterSoftDeleteMiddleware(),
        // ],
      },
    }),
  ],
  // exports: [PrismaModule],
})
export class PrismaConfigModule {}
