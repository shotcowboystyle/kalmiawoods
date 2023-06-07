import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule as JModule } from '@nestjs/jwt';

import { UserModule } from '@/modules/user/user.module';

import { AbilityService } from './ability.service';
import { kwAuthzGuard } from './kw.authz.guard';

export const JwtModule = JModule.register({
  secret: 'someSecretValueForAccess',
});

@Module({
  imports: [ConfigModule, UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: kwAuthzGuard,
    },
    AbilityService,
  ],
  exports: [],
})
export class AuthzModule {}
