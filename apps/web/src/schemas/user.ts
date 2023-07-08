import { z } from 'zod';

import { AuthUser } from './auth';

export const UserProfile = z.object({
  address: z.string().optional(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  mobilePhone: z.string().nonempty(),
  avatar: z.string().optional(),
});

export const User = AuthUser.merge(UserProfile);

export const NoIDUser = User.omit({ id: true, role: true, status: true });
export type NoIDUser = z.infer<typeof NoIDUser>;

export const Users = User.array();
