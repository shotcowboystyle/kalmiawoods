import { action, atom, computed, map } from 'nanostores';

import { apiRoute } from '@/stores/routes';
import type { User } from '@/types/user';
import { convertArrayToObjectsByKey } from '@/utils/collection';
import { createFetcherStore, isReady } from './fetcher';

const API_URL = apiRoute('users');

export const viewMode = atom('latest');
export const setViewMode = action(viewMode, 'setViewMode', (viewMode, newValue: string) => viewMode.set(newValue));

const skipUsers = atom('0');
const setSkipUsers = action(skipUsers, 'setSkipUsers', (skip, payload: string) => skip.set(payload));

const takeUsers = atom('5');
const setTakeUsers = action(takeUsers, 'setTakeUsers', (take, payload: string) => take.set(payload));

export const users = map<Record<string, User>>({});
// const setUsers = action(users, 'setUsers', (target, payload: User[]) => {
//   if (payload.length > 0) {
//     target.set([...target.get(), ...payload]);
//   }
// });

const hasMoreUsers = atom(true);
const setHasMoreUsers = action(hasMoreUsers, 'setHasMoreUsers', (h, payload: boolean) => h.set(payload));

const usersPartial = createFetcherStore<User[]>([API_URL, '?take=', takeUsers, '&skip=', skipUsers]);
usersPartial.subscribe((r) => {
  if (isReady(r)) {
    const mappedUsers = convertArrayToObjectsByKey(r.data, 'id');
    users.set(mappedUsers);
    setHasMoreUsers(r.data.length === +takeUsers.get());
  }
});

export const fetchNewUsers = () => {
  if (hasMoreUsers.get()) {
    setSkipUsers(`${users.get().length}`);
  }
};

export const addUser = action(users, 'addUser', async (store, newUser) => {
  const { id } = newUser;
  const existingEntry = store.get()[id];
  if (existingEntry) {
    store.setKey(id, {
      ...existingEntry,
      ...newUser,
    });
  } else {
    store.setKey(id, newUser);
  }
});

export const removeUser = action(users, 'removeUser', (store, userId) => {
  if (store.get()[userId]) {
    store.setKey(userId, undefined);
  }
});

// const _user = createFetcherStore<User>([API_URL, '/', viewMode]);
// export const user = computed([_user], (res) => (isReady(res) ? res.data : undefined));

const initUserData = {
  id: null,
  email: null,
  emailVerified: false,
  role: 'USER',
  status: 'CREATED',
  address: null,
  firstName: null,
  lastName: null,
  mobilePhone: null,
  avatar: null,
};

export const activeUserId = atom<string>(null);
export const setActiveUserId = action(activeUserId, 'setActiveUserId', (id, newVal) => id.set(newVal));

export const user = computed(
  [users, activeUserId],
  (_users, _userId) => Object.values(_users).find((u) => u.id === _userId) ?? initUserData,
);
