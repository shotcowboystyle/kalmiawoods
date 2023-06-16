import { CookieAttributes } from 'js-cookie';
export type SupportedStorage = 'local' | 'secureLs' | 'cookie' | 'capacitor';

export interface AuthOptions {
  endpoints: {
    login: string;
    signup: string;
    forgotPassword: string;
    logout: string;
    user: string;
    refresh?: string;
  };
  errorProperty: string;
  signup: {
    enabled: boolean;
    accessTokenProperty: string;
    refreshTokenProperty: string;
  };
  token: {
    property: string;
    refreshProperty?: string;
    type: 'Bearer' | string;
    storageName: string;
    autoDecode: boolean;
    name: string;
  };
  user: {
    autoFetch: boolean;
    property: string;
    storageName: string;
    graphqlQuery?: object;
  };
  logout: {
    graphqlQuery?: object;
  };
  refreshToken: {
    enabled: boolean;
    property: string;
    accessTokenProperty: string;
    refreshTokenProperty: string;
    maxAge: number;
    storageName: string;
    name: string;
    autoLogout: boolean;
    graphqlQuery?: object;
  };
  moduleName: string;
  expiredStorage: string;
  redirect: {
    home: string;
    login: string;
    logout: string;
  };
  registerAxiosInterceptors: boolean;
  storage: {
    driver: SupportedStorage;
    async: boolean;
  };
  restApiType: 'rest' | 'graphql';
  cookie?: CookieAttributes;
  baseURL?: string;
}
