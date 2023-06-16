import { LOGIN_USER } from '@graphql/mutations/userMutations';
import { GET_USER } from '@graphql/queries/userQueries';
import type { User } from '@stores/userStore';
import { fetchAPI } from '@utils/fetch';
import type { AstroCookies } from 'astro';

const accessCookie = 'at';
const refreshCookie = 'rt';

interface Credentials {
  email: String;
  password: String;
}

interface AuthenticationResponse {
  accessToken: String;
  refreshToken: String;
}

// horrible horror below...

const authenticate = async (credentials: Credentials): Promise<AuthenticationResponse | null> => {
  const variables = {
    email: credentials.email,
    password: credentials.password,
  };
  const data = await fetchAPI(LOGIN_USER, { variables });

  const authResponse = data.login as AuthenticationResponse;
  return authResponse;
};

const isAllowed = (user: User | null, allowedRoles: Array<String>): Boolean => {
  let isAllowed = true;
  allowedRoles.forEach((role) => {
    if (!user?.roles.includes(role)) isAllowed = false;
  });
  return isAllowed;
};

const getUser = async (cookies: AstroCookies): Promise<User | null> => {
  if (!cookies.has(accessCookie)) {
    return null;
  }
  const token = cookies.get(accessCookie).value;

  const data = await fetchAPI(GET_USER, {}, token);

  // if (resp.status == 401) {
  //   return null;
  // }
  // if (resp.status != 200) {
  //   console.log("Unexpected response status!");
  //   return null;
  // }

  return data?.me;
};

export { accessCookie, authenticate, getUser, isAllowed, refreshCookie };
