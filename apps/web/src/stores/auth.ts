import { persistentMap } from '@nanostores/persistent';
import { onMount, task } from 'nanostores';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

enum Status {
  CREATED = 'CREATED',
  REGISTERED = 'REGISTERED',
  DELETED = 'DELETED',
}

interface AuthUser {
  isLoading: boolean;
  email: string;
  role: Role;
  status: Status;
  name: string;
  avatar: string;
}

export const authUser = persistentMap<AuthUser>(
  'authUser:',
  {
    isLoading: false,
    email: '',
    role: Role.USER,
    status: Status.CREATED,
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
      const response = await fetch('/api/auth-user', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const authUserData = {
        email: data.email,
        role: data.role,
        status: data.status,
        name: `${data.firstName} ${data.lastName}`,
        avatar: data.avatar,
      };

      authUser.set({ isLoading: false, ...authUserData });
    } catch (e) {
      console.log(e);
    }
  });
});
