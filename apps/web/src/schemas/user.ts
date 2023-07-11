import { z } from 'zod';

import { AuthUserSchema } from './auth';

export const UserProfileSchema = z.object({
  id: z.string(),
  address: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  mobilePhone: z.string().length(10),
  avatar: z.string().optional(),
});

export const UserProfileWithoutIdSchema = UserProfileSchema.omit({ id: true });

export const AuthUserWithProfileSchema = AuthUserSchema.merge(z.object({ profile: UserProfileSchema }));

export const UserSchema = AuthUserSchema.merge(UserProfileWithoutIdSchema);

export const UserWithoutIdSchema = UserSchema.omit({ id: true });

export const UsersSchema = UserSchema.array();
