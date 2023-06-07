import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule as JModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CacheModule } from '@/lib/cache/cache.module';
import { AuthzModule } from '@/modules/authz/authz.module';
import { UserModule } from '@/modules/user/user.module';
import { EncryptionService } from '@/services/encryption.service';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { LoginResolver } from './providers/login.resolver';
import { LogoutResolver } from './providers/logout.resolver';
import { RegisterResolver } from './providers/register.resolver';

export const JwtModule = JModule.register({
  secret: 'someSecretValueForAccess',
});

@Module({
  imports: [
    AuthzModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule,
    UserModule,
    CacheModule,
  ],
  providers: [
    LoginResolver,
    RegisterResolver,
    AuthService,
    JwtStrategy,
    EncryptionService,
    LogoutResolver,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
