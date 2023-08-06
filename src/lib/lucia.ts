import { prisma } from '@lucia-auth/adapter-prisma';
import { lucia } from 'lucia';
import { astro } from 'lucia/middleware';

import { prisma as prismaClient } from '@/lib/db.js';

export const auth = lucia({
  env: import.meta.env.DEV ? 'DEV' : 'PROD',
  adapter: prisma(prismaClient),
  middleware: astro(),
  experimental: {
    debugMode: false,
  },
  getUserAttributes: (userData) => ({
    // IMPORTANT!!!!
    // `userId` included by default!!
    // userId: userData.id,
    email: userData.email,
    emailVerified: Boolean(userData.email_verified),
    role: userData.role,
  }),
});

export type Auth = typeof auth;
