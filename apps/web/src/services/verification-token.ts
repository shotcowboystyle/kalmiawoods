import { idToken } from '@lucia-auth/tokens';

import { auth } from '@/lib/lucia';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours
const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = 1000 * 60 * 60 * 12; // 12 hours

export const emailVerificationToken = idToken(auth, 'email_verification', {
  expiresIn: EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
});

export const passwordResetToken = idToken(auth, 'password_reset', {
  expiresIn: EXPIRES_IN,
});
