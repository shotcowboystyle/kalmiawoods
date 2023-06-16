import { action, atom } from 'nanostores';
// import { persistentAtom, persistentMap } from '@nanostores/persistent';
import { persistentMap } from '@nanostores/persistent';
import { z } from 'zod';

// import type { User } from './user';
import { fetchAPI } from '../lib/api';
import { Auth as AuthSchema } from '../schemas/auth';

interface UserData {
  email: string;
  password: string;
}

type Auth = z.infer<typeof AuthSchema>;

const GRAPHQL_URL = import.meta.env.PUBLIC_GRAPHQL_URL;

// export const authenticatedUser = persistentAtom<User | null>('authenticatedUser', null, {
//   encode: JSON.stringify,
//   decode: JSON.parse,
// });
export const authenticatedUser = persistentMap<Auth>(
  'user:',
  {
    valid: false,
    userId: '',
    accessToken: '',
    isAuthenticated: false,
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

export const isAuthenticated = atom<Boolean>(false);
export const accessToken = atom<String>('');
// export const profile = atom<Object>({})

// const _ewbImages = createFetcherStore<z.infer<typeof EWBImages>>([API_URL])
// export const ewbImages = computed([_ewbImages], (res) => (isReady(res) ? EWBImages.parse(res.data) : undefined))

export const login = action(authenticatedUser, 'login', async (user, userData: UserData) => {
  const LOGIN_USER = `
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        accessToken
        userId
      }
    }`;

  const GET_USER = `
    {
      me {
        createdAt
        email
        firstName
        lastName
        status
        uid
        updatedAt
      }
    }`;

  const variables = {
    email: userData.email,
    password: userData.password,
  };

  const data = await fetchAPI(LOGIN_USER, { variables });
  const isValid = data.login.userId.length > 0;
  const authData = AuthSchema.parse({ valid: isValid, ...data.login });

  user.set({ ...authData, isAuthenticated: isValid });

  const getUserData = await fetchAPI(GET_USER, {}, authData.accessToken);
  console.log('USER DATA', getUserData);
});

export const logout = action(authenticatedUser, 'logout', async (user) => {
  const formData = new FormData();
  formData.append('logout', '1');

  const res = await fetch(GRAPHQL_URL, { method: 'POST', body: formData });
  const data = AuthSchema.parse(await res.json());

  user.set({ ...data, isAuthenticated: false });
});
