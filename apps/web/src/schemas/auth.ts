import { z } from 'zod';

export const AuthUser = z.object({
  id: z.string(),
  password: z.string().optional(),
  email: z.string(),
  emailVerified: z.boolean().default(false),
  role: z.enum(['USER', 'ADMIN']).optional(),
  status: z.enum(['CREATED', 'DELETED', 'REGISTERED']).optional(),
});

const AuthFields = z.object({
  valid: z.boolean(),
  isLoggedIn: z.boolean().optional(),
  err: z
    .object({
      type: z.enum(['login', 'logout']),
    })
    .optional(),
});

export const Auth = AuthFields.merge(AuthUser);

export const AuthUserID = AuthUser.pick({ id: true });
export type AuthUserID = z.infer<typeof AuthUserID>;
