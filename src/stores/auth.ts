import { persistentMap } from '@nanostores/persistent';
import { onMount, task } from 'nanostores';

import { fetchGet } from '@/utils/fetchClient';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

interface AuthUser {
  isLoading: boolean;
  email: string;
  role: Role;
  name: string;
  avatar: string;
}

export const authUser = persistentMap<AuthUser>(
  'authUser:',
  {
    isLoading: false,
    email: '',
    role: Role.USER,
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
      const data = await fetchGet('auth-user');
      const authUserData = {
        email: data.email,
        role: data.role,
        name: `${data.firstName} ${data.lastName}`,
        avatar: data.avatar,
      };

      authUser.set({ isLoading: false, ...authUserData });
    } catch (e) {
      // console.log(e);
    }
  });
});
