import {
  Prisma,
  PrismaModule,
  PrismaServiceOptions,
} from '@kalmiawoods/database';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ConfigName } from '@/common/constants/config-name.constant';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const prismaConfigOptions =
          configService.get<Prisma.PrismaClientOptions>(ConfigName.PRISMA);
        return <PrismaServiceOptions>{
          prismaOptions: prismaConfigOptions,
        };
      },
    }),
  ],
  exports: [PrismaModule],
})
export class PrismaConfigModule {}
