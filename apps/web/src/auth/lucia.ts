import { prismaClient } from '@/db.js';
import prisma from '@lucia-auth/adapter-prisma';
import { idToken } from '@lucia-auth/tokens';
import lucia from 'lucia-auth';
import { astro } from 'lucia-auth/middleware';

export const auth = lucia({
  env: import.meta.env.DEV ? 'DEV' : 'PROD',
  adapter: prisma(prismaClient),
  middleware: astro(),
  experimental: {
    debugMode: false,
  },
  transformDatabaseUser: (userData) => ({
    userId: userData.id,
    email: userData.email,
    emailVerified: userData.email_verified,
    role: userData.role,
    status: userData.status,
  }),
});

export type Auth = typeof auth;

export const emailVerificationToken = idToken(auth, 'email_verification', {
  expiresIn: 60 * 60,
});

export const passwordResetToken = idToken(auth, 'password_reset', {
  expiresIn: 60 * 60,
});

export const completeRegistrationToken = idToken(auth, 'complete_registration', {
  expiresIn: 60 * 60,
});
