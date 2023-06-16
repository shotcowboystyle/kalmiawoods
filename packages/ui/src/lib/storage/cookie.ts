import Cookies from 'js-cookie';
import { AuthOptions, Storage } from '../../types';

export class CookieStorage implements Storage {
  set(key: string, value: any, options?: AuthOptions) {
    Cookies.set(key, JSON.stringify(value), options?.cookie);
  }

  get(key: string, defaultValue: any) {
    try {
      const value = Cookies.get(key);
      return JSON.parse(value!);
    } catch {
      return defaultValue;
    }
  }

  remove(key: string) {
    Cookies.remove(key);
  }

  clear(options: AuthOptions) {
    Cookies.remove(options.token.storageName, options.cookie);
    Cookies.remove(options.user.storageName, options.cookie);
    Cookies.remove(options.expiredStorage, options.cookie);
    Cookies.remove(options.refreshToken.storageName, options.cookie);
  }
}
