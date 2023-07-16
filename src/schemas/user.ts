import { z } from 'zod';

import { AuthUserSchema } from './auth';

export const UserProfileSchema = z.object({
  profileId: z.string(),
  address: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  mobilePhone: z.string().length(10),
  avatar: z.string().optional(),
});

export const UserProfileWithoutIdSchema = UserProfileSchema.omit({ profileId: true });

export const AuthUserWithProfileSchema = AuthUserSchema.merge(z.object({ profile: UserProfileSchema }));

export const UserSchema = AuthUserSchema.merge(UserProfileSchema);

export const UserWithoutIdSchema = UserSchema.omit({ userId: true });

export const UsersSchema = UserSchema.array();
