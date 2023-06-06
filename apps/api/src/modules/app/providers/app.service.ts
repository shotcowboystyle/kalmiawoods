import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigName } from '@/common/constants/config-name.constant';
import { IAppEnvConfig } from '@/lib/config/configs/app.config';

@Injectable()
export class AppService {
  private readonly appConfig: IAppEnvConfig;

  constructor(private readonly configService: ConfigService) {
    this.appConfig = this.configService.get<IAppEnvConfig>(ConfigName.APP)!;
  }

  public getVersion(): string {
    return `v${this.appConfig.version}`;
  }
}
