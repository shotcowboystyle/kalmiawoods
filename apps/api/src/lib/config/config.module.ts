import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './configs/app.config';
import sentryConfig from './configs/sentry.config';
import throttleConfig from './configs/throttle.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [appConfig, sentryConfig, throttleConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
