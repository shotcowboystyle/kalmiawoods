import { PrismaService } from '@kalmiawoods/database';
import { Module } from '@nestjs/common';

import { ReservationResolver } from './providers/reservation.resolver';
import { ReservationService } from './reservation.service';

@Module({
  providers: [PrismaService, ReservationService, ReservationResolver],
  exports: [ReservationService],
})
export class ReservationModule {}
