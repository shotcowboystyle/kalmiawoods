import { z } from 'zod';

import {
  AuthUserWithProfileSchema,
  UserProfileSchema,
  UserProfileWithoutIdSchema,
  UserSchema,
  UserWithoutIdSchema,
} from '@/schemas/user';

export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserWithoutId = z.infer<typeof UserWithoutIdSchema>;
export type UserProfileWithoutId = z.infer<typeof UserProfileWithoutIdSchema>;
export type UserWithProfile = z.infer<typeof AuthUserWithProfileSchema>;
// export type DisplayableUserDetails = z.infer<typeof DisplayableUserDetailsSchema>;

// export type UserWithProfileData = z.infer<typeof DisplayableUserDetailsSchema>;
