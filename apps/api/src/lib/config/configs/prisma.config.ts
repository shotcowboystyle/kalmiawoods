import { Prisma } from '@kalmiawoods/database';
import { registerAs } from '@nestjs/config';

import { ConfigName } from '@/common/constants/config-name.constant';

const prismaConfig = registerAs(
  ConfigName.PRISMA,
  (): Prisma.PrismaClientOptions => ({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'info' },
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ],
    errorFormat: 'colorless',
  }),
);

export default prismaConfig;
