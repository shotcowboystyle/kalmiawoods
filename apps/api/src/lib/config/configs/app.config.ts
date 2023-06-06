import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { EnvType } from '@/common/@types';
import { ConfigName } from '@/common/constants/config-name.constant';
import JoiEnvValidator, { JoiConfig } from '@/common/helpers/joi-env.utils';

export interface IAppEnvConfig {
  environment: EnvType;
  isTesting: boolean;
  isProduction: boolean;
  domain: string;
  port: number;
  swaggerEnabled: boolean;
  version: string;
}

export default registerAs(ConfigName.APP, (): IAppEnvConfig => {
  const config: JoiConfig<IAppEnvConfig> = {
    environment: {
      value: process.env.NODE_ENV,
      joi: Joi.string()
        .valid('development', 'testing', 'staging', 'production')
        .required(),
    },
    isTesting: {
      value: process.env.NODE_ENV === 'testing',
      joi: Joi.boolean().required(),
    },
    isProduction: {
      value: process.env.NODE_ENV === 'production',
      joi: Joi.boolean().required(),
    },
    domain: {
      value: process.env.DOMAIN,
      joi: Joi.string().required(),
    },
    port: {
      value: parseInt(process.env.PORT || '4000', 10),
      joi: Joi.number().required(),
    },
    swaggerEnabled: {
      value: process.env.SWAGGER_ENABLED === 'true',
      joi: Joi.boolean().required(),
    },
    version: {
      value: process.env.npm_package_version,
      joi: Joi.string().required(),
    },
  };

  return JoiEnvValidator.validate(config);
});
