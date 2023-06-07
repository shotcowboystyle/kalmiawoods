import FastifyCompression from '@fastify/compress';
import FastifyCors from '@fastify/cors';
import FastifyHelmet from '@fastify/helmet';
import FastifySecureSession from '@fastify/secure-session';
import { PrismaService } from '@kalmiawoods/database';
import {
  Logger as AppLogger,
  ClassSerializerInterceptor,
  // VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import AltairPlugin from 'altair-fastify-plugin';
import { readFileSync } from 'fs';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { join } from 'path';
import * as qs from 'qs';

import { EnvEnum } from '@/common/@types/enums/env.enum';
import { KALMIA_WOODS_BANNER } from '@/common/constants/banner.constants';
import { ConfigName } from '@/common/constants/config-name.constant';
import { GlobalGraphQLFilter } from '@/common/exceptions/filters/gql.exception.filter';
// import { HttpExceptionFilter } from '@/common/exceptions/filters/http.exception.filter';
import { PrismaClientExceptionFilter } from '@/common/exceptions/filters/prisma-client-exception.filter';
import { setupSwagger } from '@/common/helpers/swagger.utils';
import RequestValidationPipe from '@/common/pipes/request-validation.pipe';
import { IAppEnvConfig } from '@/lib/config/configs/app.config';
import { AppModule } from '@/modules/app/app.module';

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
    {
      logger: ['error', 'warn', 'debug'],
      bufferLogs: true,
      abortOnError: true,
    },
  );

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppEnvConfig>(ConfigName.APP)!;

  // use pino logger
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.register(FastifySecureSession, {
    key: Buffer.from(appConfig.sessionKey, 'hex'),
    cookieName: appConfig.sessionSecret,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // expiration in seconds (24 hours)
      sameSite: true,
      secure: true,
    },
  });

  // Configure Middleware
  // app.register(FastifyHelmet, {
  //   contentSecurityPolicy: appConfig.isProduction,
  // });
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
    // preflightContinue: true,
    credentials: true,
    origin: !appConfig.isProduction
      ? '*'
      : `https://${appConfig?.domain || 'localhost'}`,
  });

  // Use custom api error response
  // Filters - NOTE: Filters should be ordered from the most generic to the most specific
  app.useGlobalFilters(new GlobalGraphQLFilter());
  // app.useGlobalFilters(new HttpExceptionFilter());

  // prisma exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Configure ClassSerializerInterceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configure ValidationPipe
  app.useGlobalPipes(
    new RequestValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );

  // Enable api versioning with URI prefix (e.g. /v1/*)
  app.enableVersioning({
    type: VersioningType.URI,
    // type: VersioningType.HEADER,
    // defaultVersion: VERSION_NEUTRAL,
    // header: 'API-Version',
  });

  // Configure Swagger
  if (appConfig?.swaggerEnabled) {
    await setupSwagger(app, 'docs');
  }

  // Configure GraphQL IDE
  if (
    appConfig?.environment !== EnvEnum.Prod &&
    appConfig?.environment !== EnvEnum.Testing
  ) {
    app.getHttpAdapter().getInstance().register(AltairPlugin, {
      path: '/altair',
      baseURL: '/altair/',
      endpointURL: '/graphql',
    });
  }

  app.enableShutdownHooks();
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Start server
  try {
    await app.listen(appConfig.port, appConfig.domain || '0.0.0.0');

    const appUrl = await app.getUrl();
    AppLogger.log(KALMIA_WOODS_BANNER);
    AppLogger.log(`==========================================================`);
    AppLogger.log(
      `🚀 ${appConfig.environment.toUpperCase()} Server is running on : ${appUrl}/v1/health`,
    );
    if (appConfig?.swaggerEnabled) {
      AppLogger.log(`📑 Swagger is running on : ${appUrl}/docs`);
    }
    if (
      appConfig?.environment !== EnvEnum.Prod &&
      appConfig?.environment !== EnvEnum.Testing
    ) {
      AppLogger.log(`📑 GraphQL debugger is running on : ${appUrl}/altair`);
    }
    AppLogger.log(`==========================================================`);
  } finally {
    await prismaService.$disconnect();
  }

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
