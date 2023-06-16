import { AuthOptions } from './options';

export type { AuthOptions, SupportedStorage } from './options';
export type { AuthError, AuthUser } from './plugin';
export type { Storage, StorageAsync } from './storage';

export type AuthRouterMeta = 'user' | 'public' | 'guest';

export interface AppContext {
  options?: AuthOptions;
}
