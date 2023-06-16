import { PrismaService } from '@kalmiawoods/database';
import { Module } from '@nestjs/common';

import { ReservationService } from '@/modules/reservation/reservation.service';
import { EncryptionService } from '@/services/encryption.service';

import { UserResolver } from './providers/user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [
    PrismaService,
    UserService,
    UserResolver,
    EncryptionService,
    ReservationService,
  ],
  exports: [UserService],
})
export class UserModule {}
