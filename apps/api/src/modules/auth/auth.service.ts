import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Result, err, ok } from 'neverthrow';
// import { GraphQLError } from 'graphql';
import { User } from '@kalmiawoods/database';
import ms, { StringValue } from 'ms';

import { IContext } from '@/common/@types';
import { ConfigName } from '@/common/constants/config-name.constant';
import { ServiceException } from '@/common/exceptions/service.exception';
// import { User } from '@/common/entities/user.entity';
import { CacheService } from '@/lib/cache/cache.service';
import { IAppEnvConfig } from '@/lib/config/configs/app.config';
import { UserService } from '@/modules/user/user.service';
import { EncryptionService } from '@/services/encryption.service';

import { RegisterInputDTO } from './dtos/register.input.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { AccessTokenDTO } from './refresh/dtos/access-token.dto';

@Injectable()
export class AuthService {
  private readonly appConfig: IAppEnvConfig;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CacheService) private cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
  ) {
    this.appConfig = this.configService.get<IAppEnvConfig>(ConfigName.APP)!;
  }

  private readonly logger: Logger = new Logger(AuthService.name);

  /**
   * Process to register the new user
   * @param registerInput
   * @returns
   */
  public async register(
    registerInput: RegisterInputDTO,
  ): Promise<Result<User, Error>> {
    const user = await this.userService.user({
      email: registerInput.email,
    });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
      // throw new GraphQLError('This user already exists.', {
      //   extensions: {
      //     code: 'FORBIDDEN',
      //     myExtension: 'm8a-error-code-1002',
      //   },
      // });
    }

    const hashedPassword = await this.encryptionService.hash(
      registerInput.password,
    );

    const updatedUser = await this.userService.updateUser({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        status: 'REGISTERED',
      },
    });

    if (updatedUser.isErr()) {
      const error = updatedUser.error;
      return err(new ServiceException('UNKNOWN', error.cause));
    }

    return ok(updatedUser.value);
  }

  /**
   *
   * @param email
   * @param password
   * @param ctx
   * @returns a valid access token and the user's id, which is the AccessTokenDTO.
   */
  async login(
    email: string,
    password: string,
    ctx: IContext,
  ): Promise<Result<AccessTokenDTO, Error>> {
    const user = await this.userService.user({
      email,
    });

    if (!user) {
      return err(new ServiceException('USER_NOT_FOUND'));
    }

    const isPasswordCorrect = await this.encryptionService.verifyHash(
      user.password!,
      password,
    );

    if (!isPasswordCorrect) {
      return err(new ServiceException('WRONG_PASSWORD'));
    }

    if (user.status !== 'REGISTERED') {
      return err(new ServiceException('INCOMPLETE_REGISTRATION'));
    }

    const payload: IJwtPayload = { sub: user.uid };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.appConfig.accessSecret,
        expiresIn: this.appConfig.accessTtl,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.appConfig.refreshSecret,
        expiresIn: this.appConfig.refreshTtl,
      }),
    ]);

    const cachedResponse = await this.cacheService.set(
      'refreshToken',
      user.uid,
      refreshToken,
    );

    const ttlInMillis = ms(this.appConfig.refreshTtl as StringValue);

    ctx.res.setCookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + ttlInMillis),
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    this.logger.log(
      'user logged in and sending Access Token and User Id ',
      accessToken,
      user.uid,
    );

    return ok({ accessToken, userId: user.uid });
  }

  /**
   *
   * @param ctx
   * @returns a nulled out AccessTokenDTO
   */
  async logout(ctx: IContext): Promise<AccessTokenDTO> {
    const accessToken = '';
    const token = ctx.req.cookies.refreshToken;
    let userId = ctx.req.user.userId;

    ctx.res.setCookie('refreshToken', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
      path: '/', // TODO: set path to refresh
      sameSite: 'none',
      secure: true,
    });

    this.cacheService.revoke(token, userId);
    userId = '';
    ctx.req.cookies.refreshToken = '';

    this.logger.log('logged out user');

    return { accessToken, userId };
  }
}
