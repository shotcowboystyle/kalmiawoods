import { z } from 'zod';

export const AuthUser = z.object({
  id: z.string(),
  email: z.string().nonempty(),
  emailVerified: z.boolean().default(false),
  role: z.enum(['USER', 'ADMIN']),
  status: z.enum(['CREATED', 'DELETED', 'REGISTERED']),
});

const AuthFields = z.object({
  name: z.string().nonempty(),
  avatar: z.string().optional(),
  // err: z
  //   .object({
  //     type: z.enum(['login', 'logout']),
  //   })
  //   .optional(),
});

export const Auth = AuthFields.merge(AuthUser).required();

export const AuthUserID = AuthUser.pick({ id: true });
export type AuthUserID = z.infer<typeof AuthUserID>;

export const AuthUserNoID = Auth.omit({
  id: true,
  emailVerified: true,
}).required();
export type AuthUserNoID = z.infer<typeof AuthUserNoID>;
