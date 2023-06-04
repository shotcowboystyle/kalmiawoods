import FastifyCompression from '@fastify/compress';
import FastifyCors from '@fastify/cors';
import FastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import {
  Logger as AppLogger,
  ClassSerializerInterceptor,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { join } from 'path';

import { AppModule } from '@/app.module';

import { ConfigName } from './common/constants/config-name.constant';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './common/helpers/swagger.utils';
import RequestValidationPipe from './common/pipes/request-validation.pipe';
import { IAppEnvConfig } from './lib/config/configs/app.config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppEnvConfig>(ConfigName.APP);

  // Configure static assets
  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    decorateReply: true,
  });

  // use pino logger
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Use custom api error response
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configure ClassSerializerInterceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configure ValidationPipe
  app.useGlobalPipes(
    new RequestValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );

  // Configure Middlewares
  app.register(FastifyHelmet, {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
        scriptSrc: ["'self'", "https: 'unsafe-inline'"],
      },
    },
  });

  app.register(FastifyCompression);
  app.register(FastifyCors, {
    preflightContinue: true,
    credentials: true,
    // origin: `https://${configService.get<string>('DOMAIN')}`,
  });

  // Enable api versioning with URI prefix (e.g. /v1/*)
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Configure Swagger and Redocly
  if (appConfig?.swaggerEnabled) {
    await setupSwagger(app, '/docs');
  }

  // Start server
  app.listen(appConfig?.port || 3000).then(() => {
    const port = app.getHttpServer().address().port;

    AppLogger.log(`🚀 Server started on http://localhost:${port}`);
    if (appConfig?.swaggerEnabled) {
      AppLogger.log(`📖 Swagger started on http://localhost:${port}/docs`);
    }
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
