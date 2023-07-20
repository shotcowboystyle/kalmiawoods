import { persistentMap } from '@nanostores/persistent';
import { onMount, task } from 'nanostores';

import { RoleEnum as Role } from '@/schemas/auth';
import type { RoleEnum } from '@/types/Auth';
import { fetchGet } from '@/utils/fetchClient';

interface AuthUser {
  isLoading: boolean;
  email: string;
  role: RoleEnum;
  isAdmin: boolean;
  name: string;
  avatar: string;
}

export const authUser = persistentMap<AuthUser>(
  'authUser:',
  {
    isLoading: false,
    email: '',
    role: Role.enum.USER,
    isAdmin: false,
    name: '',
    avatar: '',
  },
  {
    encode(value) {
      return JSON.stringify(value);
    },
    decode(value) {
      if (value !== '') {
        return JSON.parse(value);
      }
      return value;
    },
  },
);

onMount(authUser, () => {
  authUser.setKey('isLoading', true);

  task(async () => {
    try {
      const data = await fetchGet('auth');
      const authUserData = {
        email: data.email,
        role: data.role,
        isAdmin: data.role === Role.enum.ADMIN,
        name: `${data.firstName} ${data.lastName}`,
        avatar: data.avatar,
      };

      authUser.set({ isLoading: false, ...authUserData });
    } catch (e) {
      // console.log(e);
    }
  });
});
