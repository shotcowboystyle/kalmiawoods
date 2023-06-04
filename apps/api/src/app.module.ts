import { HttpException, Module } from '@nestjs/common';
// import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@ntegral/nestjs-sentry';

// import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import {
  AppConfigModule,
  LoggerConfigModule,
  SentryConfigModule,
  ThrottlerConfigModule,
} from './lib';
import { HealthCheckModule } from './modules/health-check/health-check.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerConfigModule,
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
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerBehindProxyGuard,
    // },
  ],
})
export class AppModule {}
