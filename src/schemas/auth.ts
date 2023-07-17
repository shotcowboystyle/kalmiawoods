import { z } from 'zod';

export const RoleEnum = z.enum(['USER', 'ADMIN']);

export const AuthUserSchema = z.object({
  userId: z.string(),
  email: z.string().nonempty(),
  emailVerified: z.boolean().optional(),
  role: RoleEnum,
});

export const AuthUserNoIdSchema = AuthUserSchema.omit({
  userId: true,
});
