// import { PrismaClient } from '@prisma/client';

// // Avoid instantiating too many instances of Prisma in development
// // https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem
// let prismaClient;

// if (process.env.NODE_ENV === 'production') {
//   prismaClient = new PrismaClient();
// } else {
//   if (!global.prismaClient) {
//     global.prismaClient = new PrismaClient();
//   }
//   prismaClient = global.prismaClient;
// }

// export default prismaClient;

import { PrismaClient } from "@prisma/client"

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined
}

export const prisma =
	globalThis.prisma ||
	new PrismaClient({
		log:
			import.meta.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	})

if (import.meta.env.NODE_ENV !== "production") {
	globalThis.prisma = prisma
}
