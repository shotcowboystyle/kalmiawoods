import { atom, action } from 'nanostores';

import type { User } from './user';

const initialValue = [];

const users = atom<User[] | []>(initialValue);
export default users;

// export const addUser = (user: User) => {
//   users.set([...users.get(), user]);
// };

export const addUser = action(users, 'addUser', (store, user: User) => {
  store.set(store.get().concat(user));
});
