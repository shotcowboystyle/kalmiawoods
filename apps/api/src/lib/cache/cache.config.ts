import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

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

    return appConfig?.isTesting
      ? { ttl }
      : {
          store: await redisStore({
            ttl,
            ...redisOptions,
          }),
        };
  }
}
