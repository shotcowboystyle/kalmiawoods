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

import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prismaClient: PrismaClient | undefined;
};

const prismaClient = globalForPrisma.prismaClient ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaClient = prismaClient;
}

export { Prisma, prismaClient };
