import FastifyCompression from '@fastify/compress';
import FastifyCors from '@fastify/cors';
import FastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import { PrismaService } from '@kalmiawoods/database';
import {
  Logger as AppLogger,
  ClassSerializerInterceptor,
  VersioningType,
} from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { readFileSync } from 'fs';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { join } from 'path';
import * as qs from 'qs';

import { AppModule } from '@/app.module';
import { EnvEnum } from '@/common/@types/enums/env.enum';

import { ConfigName } from './common/constants/config-name.constant';
import { HttpExceptionFilter } from './common/exceptions/filters/http-exception.filter';
import { setupSwagger } from './common/helpers/swagger.utils';
import RequestValidationPipe from './common/pipes/request-validation.pipe';
import { IAppEnvConfig } from './lib/config/configs/app.config';

declare const module: any;

async function bootstrap() {
  const httpsOptions: HttpsOptions = {
    cert: readFileSync(join(__dirname, '../../../ssl/certificate.pem')),
    key: readFileSync(join(__dirname, '../../../ssl/key.pem')),
  };
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      querystringParser: (str: string) => qs.parse(str),
      // Set Fastify options: https://www.fastify.io/docs/latest/Server/
      http2: true,
      https: {
        allowHTTP1: true,
        ...httpsOptions,
      },
      ignoreTrailingSlash: true,
      bodyLimit: 1048576,
      logger: {
        level: process.env.LOG_LEVEL,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
          },
        },
      },
    }),
    { bufferLogs: true },
  );

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppEnvConfig>(ConfigName.APP);

  // use pino logger
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Use custom api error response
  // Filters - NOTE: Filters should be ordered from the most generic to the most specific
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

  // Configure static assets
  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    decorateReply: true,
  });

  // Configure Middleware
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

  // Configure Swagger
  if (appConfig?.swaggerEnabled) {
    await setupSwagger(app, 'docs');
  }

  if (appConfig?.environment === EnvEnum.Prod) {
    app.enableShutdownHooks();
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
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
