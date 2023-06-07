import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

import { ConfigName } from '@/common/constants/config-name.constant';

import { IAppEnvConfig } from '../config/configs/app.config';
import {
  IRedisConfig,
  redisUrlToOptions,
} from '../config/configs/redis.config';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    const redisConfig = this.configService.get<IRedisConfig>(ConfigName.REDIS);
    const appConfig = this.configService.get<IAppEnvConfig>(ConfigName.APP);

    const ttl = redisConfig?.redisCacheTtl;
    const redisOptions = redisConfig?.redisUrl
      ? redisUrlToOptions(redisConfig.redisUrl)
      : {};

    const store = await redisStore({
      socket: {
        host: redisOptions.host,
        port: redisOptions.port,
      },
      password: redisOptions.password,
      ttl: 60 * 60 * 24 * 7,
    });

    return appConfig?.isTesting
      ? { ttl }
      : {
          store,
          // host: redisOptions.host,
          // port: redisOptions.port,
          // username: redisOptions.username,
          // password: redisOptions.password,
          // db: 0,
          // ttl,
          // store: await redisStore({
          //   ttl,
          //   ...redisOptions,
          // }),
        };
  }
}

// imports: [ConfigModule],
// useFactory: async (config: ConfigService) => {
//   const store = await redisStore({
//     socket: {
//       host: config.get('REDIS_HOST'),
//       port: +config.get('REDIS_PORT'),
//     },
//     password: config.get('REDIS_PASSWORD'),
//   });

//   return {
//     store: store as unknown as CacheStore,
//     ttl: 60 * 60 * 24 * 7,
//   };
// },
// inject: [ConfigService],
