// import { PrismaClient } from '@prisma/client';

// declare global {
// 	// eslint-disable-next-line no-var
// 	var prisma: PrismaClient | undefined;
// }

// export const prisma =
// 	globalThis.prisma ||
// 	new PrismaClient({
// 		log: import.meta.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
// 	});

// if (import.meta.env.NODE_ENV !== 'production') {
// 	globalThis.prisma = prisma;
// }

import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient();
