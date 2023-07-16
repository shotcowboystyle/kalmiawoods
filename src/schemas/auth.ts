import { z } from 'zod';

const RoleSchema = z.enum(['USER', 'ADMIN']);

export const AuthUserSchema = z.object({
  userId: z.string(),
  email: z.string().nonempty(),
  emailVerified: z.boolean().optional(),
  role: RoleSchema,
});

export const AuthUserNoIdSchema = AuthUserSchema.omit({
  userId: true,
});
