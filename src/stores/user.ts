import { action, atom, computed, map } from 'nanostores';

import { apiRoute } from '@/stores/routes';
import { convertArrayToObjectsByKey } from '@/utils/collection';
import { createFetcherStore, isReady } from './fetcher';

import type { UpdateUserProfileInput, User } from '@/types/User';

const API_URL = apiRoute('admin/users');

export const viewMode = atom('latest');
export const setViewMode = action(viewMode, 'setViewMode', (viewMode, newValue: string) => viewMode.set(newValue));

const skipUsers = atom('0');
const setSkipUsers = action(skipUsers, 'setSkipUsers', (skip, payload: string) => skip.set(payload));

const takeUsers = atom('5');
const setTakeUsers = action(takeUsers, 'setTakeUsers', (take, payload: string) => take.set(payload));

export const users = map<Record<string, User | undefined>>({});

const hasMoreUsers = atom(true);
const setHasMoreUsers = action(hasMoreUsers, 'setHasMoreUsers', (h, payload: boolean) => h.set(payload));

const usersPartial = createFetcherStore<User[]>([API_URL, '?take=', takeUsers, '&skip=', skipUsers]);
usersPartial.subscribe((r) => {
  if (isReady(r)) {
    const mappedUsers = convertArrayToObjectsByKey(r.data, 'userId');
    users.set(mappedUsers);
    setHasMoreUsers(r.data?.length === +takeUsers.get());
  }
});

export const fetchNewUsers = () => {
  if (hasMoreUsers.get()) {
    setSkipUsers(`${users.get().length}`);
  }
};

export const usersMobilePhones = computed([users], (_users) =>
  Object.values(_users).reduce((acc, cur) => {
    if (cur?.mobilePhone?.length) {
      acc.push(cur.mobilePhone);
    }
    return acc;
  }, [] as string[]),
);

export const usersEmails = computed([users], (_users) =>
  Object.values(_users).reduce((acc, cur) => {
    if (cur?.email?.length) {
      acc.push(cur.email);
    }
    return acc;
  }, [] as string[]),
);

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

export const updateUser = action(users, 'updateUser', async (store, updatedUser) => {
  const { id } = updatedUser;
  const existingEntry = store.get()[id];
  store.setKey(id, {
    ...existingEntry,
    ...updatedUser,
  });
});

export const removeUser = action(users, 'removeUser', (store, userId) => {
  if (store.get()[userId]) {
    store.setKey(userId, undefined);
  }
});

const initUserData = {
  userId: null,
  profileId: null,
  email: null,
  emailVerified: false,
  role: 'USER',
  address: null,
  firstName: null,
  lastName: null,
  mobilePhone: null,
  avatar: null,
};

const initUserProfileData = {
  profileId: '',
  firstName: '',
  lastName: '',
  mobilePhone: '',
  address: undefined,
  avatar: undefined,
};

export const profileData = map<UpdateUserProfileInput>(initUserProfileData);

export const activeUserId = atom<string>('');
export const setActiveUserId = action(activeUserId, 'setActiveUserId', (id, newVal) => id.set(newVal));

const _activeUser = createFetcherStore<User>([API_URL, '/', activeUserId]);
export const activeUser = computed([_activeUser], (res) => {
  if (isReady(res)) {
    const { data } = res;
    if (data && Object.keys(data).length) {
      profileData.set(data);
      return data;
    }
  }
  return initUserData;
});

// export const user = computed(
//   [users, viewMode],
//   (_users, _userId) => Object.values(_users).find((u) => u?.userId === _userId) ?? initUserData,
// );
