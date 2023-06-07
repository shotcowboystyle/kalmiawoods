import { Inject, Injectable, Logger, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';

import { IFastifyReply, IFastifyRequest } from '@/common/@types';
import { ConfigName } from '@/common/constants/config-name.constant';
import { CacheService } from '@/lib/cache/cache.service';
import { IAppEnvConfig } from '@/lib/config/configs/app.config';

import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { AccessTokenDTO } from './dtos/access-token.dto';

@Injectable()
export class RefreshService {
  private readonly appConfig: IAppEnvConfig;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(CacheService) private cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    this.appConfig = this.configService.get<IAppEnvConfig>(ConfigName.APP)!;
  }

  private readonly logger: Logger = new Logger(RefreshService.name);

  async refresh(
    @Req() request: IFastifyRequest,
    @Res() reply: IFastifyReply,
  ): Promise<AccessTokenDTO> {
    const refreshToken = request.cookies.refreshToken;

    this.logger.log('refreshToken cookie accepted', request.cookies);

    const validToken = this.jwtService.verify(refreshToken, {
      secret: this.appConfig.refreshSecret,
    });

    this.logger.log('token is valid? ', validToken);

    if (!validToken) {
      return { accessToken: '', userId: '' };
    }

    const storedToken = (await this.cacheService.get(
      'refreshToken',
      validToken.sub,
    )) as string;

    this.logger.log(
      'checking stored token against cookiefied token',
      storedToken ? storedToken.slice(-8) : '',
      refreshToken ? refreshToken.slice(-8) : '',
    );

    if (refreshToken !== storedToken) {
      return { accessToken: '', userId: '' };
    }

    const payload: IJwtPayload = { sub: validToken.sub };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfig.accessSecret,
      expiresIn: this.appConfig.accessTtl,
    });

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfig.refreshSecret,
      expiresIn: this.appConfig.refreshTtl,
    });

    await this.cacheService.set(
      'refreshToken',
      validToken.sub,
      newRefreshToken,
    );

    const timeInMillis = ms(this.appConfig.refreshTtl as StringValue);

    reply.setCookie('refreshToken', newRefreshToken, {
      expires: new Date(Date.now() + timeInMillis),
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    this.logger.log(
      'refreshed again via refresh, new refreshToken',
      newRefreshToken ? newRefreshToken.slice(-8) : '',
    );

    return { accessToken: newAccessToken, userId: validToken.sub };
  }
}
