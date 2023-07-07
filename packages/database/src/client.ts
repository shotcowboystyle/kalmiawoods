// import { PrismaClient } from '@prisma/client';

// // declare global {
// //   var prisma: PrismaClient | undefined;
// // }

// // export const prisma = global.prisma || new PrismaClient();
// const prisma = new PrismaClient();

// // if (process.env.NODE_ENV !== 'production') {
// //   global.prisma = prisma;
// // }

// // export * from '@prisma/client';
// export { prisma };

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { prisma };
