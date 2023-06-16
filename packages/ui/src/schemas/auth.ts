import { z } from 'zod';

export const Auth = z.object({
  valid: z.boolean(),
  userId: z.string(),
  accessToken: z.string(),
  isAuthenticated: z.boolean().optional(),
  err: z
    .object({
      type: z.enum(['login', 'logout']),
    })
    .optional(),
});
