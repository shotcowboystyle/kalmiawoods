import prisma from '@lucia-auth/adapter-prisma';
import lucia from 'lucia-auth';
import { astro } from 'lucia-auth/middleware';

import { prisma as dbPrisma } from '@/lib/db.js';

export const auth = lucia({
  env: import.meta.env.DEV ? 'DEV' : 'PROD',
  adapter: prisma(dbPrisma),
  middleware: astro(),
  experimental: {
    debugMode: false,
  },
  transformDatabaseUser: (userData) => ({
    userId: userData.id,
    email: userData.email,
    emailVerified: Boolean(userData.email_verified),
    role: userData.role,
  }),
});

export type Auth = typeof auth;
