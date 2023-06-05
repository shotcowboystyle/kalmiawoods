import { registerAs } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import * as Joi from 'joi';

import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IRedisConfig {
  redisUrl: string;
  redisCacheTtl: number;
}

export const redisUrlToOptions = (url: string): RedisOptions => {
  if (url.includes('://:')) {
    const arr = url.split('://:')[1].split('@');
    const secondArr = arr[1].split(':');

    return {
      password: arr[0],
      host: secondArr[0],
      port: parseInt(secondArr[1], 10),
    };
  }

  const connectionString = url.split('://')[1];
  const arr = connectionString.split(':');
  return {
    host: arr[0],
    port: parseInt(arr[1], 10),
  };
};

export default registerAs(ConfigName.REDIS, (): IRedisConfig => {
  const config: JoiConfig<IRedisConfig> = {
    redisUrl: {
      value: process.env.REDIS_URL,
      joi: Joi.string().required(),
    },
    redisCacheTtl: {
      value: parseInt(process.env.REDIS_CACHE_TTL || '600', 10),
      joi: Joi.number().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
