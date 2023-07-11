import { z } from 'zod';

const RoleSchema = z.enum(['USER', 'ADMIN']);

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().nonempty(),
  emailVerified: z.boolean().optional(),
  role: RoleSchema,
});

export const AuthUserNoIdSchema = AuthUserSchema.omit({
  id: true,
});
