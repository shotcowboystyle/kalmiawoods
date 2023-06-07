import { HttpException, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@ntegral/nestjs-sentry';

import {
  AppConfigModule,
  CacheModule,
  GraphQlConfigModule,
  LoggerConfigModule,
  PrismaConfigModule,
  SentryConfigModule,
  ThrottlerConfigModule,
} from '@/lib';
import { AuthModule } from '@/modules/auth/auth.module';
import { HealthCheckModule } from '@/modules/health-check/health-check.module';
import { UserModule } from '@/modules/user/user.module';

import { AppService } from './app.service';
import { AppController } from './http/app.controller';
import { AppResolver } from './providers/app.resolver';

@Module({
  imports: [
    AppConfigModule,
    GraphQlConfigModule,
    LoggerConfigModule,
    PrismaConfigModule,
    CacheModule,
    SentryConfigModule,
    ThrottlerConfigModule,
    HealthCheckModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
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
