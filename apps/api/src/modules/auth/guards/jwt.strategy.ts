import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// import { ConfigName } from '@/common/constants/config-name.constant';
// import { IAppEnvConfig } from '@/lib/config/configs/app.config';

import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_SECRET'),
    });
  }

  validate(payload: IJwtPayload) {
    return { userId: payload.sub };
  }
}
