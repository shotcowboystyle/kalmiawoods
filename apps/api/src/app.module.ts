import { HttpException, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@ntegral/nestjs-sentry';

import {
  AppConfigModule,
  LoggerConfigModule,
  PrismaConfigModule,
  SentryConfigModule,
  ThrottlerConfigModule,
} from './lib';
import { HealthCheckModule } from './modules/health-check/health-check.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerConfigModule,
    PrismaConfigModule,
    ThrottlerConfigModule,
    SentryConfigModule,
    HealthCheckModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new SentryInterceptor({
        filters: [
          {
            type: HttpException,
            filter: (e: HttpException) =>
              !(e.getStatus() >= 500 && e.getStatus() < 600),
          },
        ],
      }),
    },
  ],
})
export class AppModule {}
