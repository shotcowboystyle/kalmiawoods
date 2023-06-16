// import { atom, action } from 'nanostores';
import { atom } from 'nanostores';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  mobilePhone?: string;
  address?: string;
  avatar?: string;
}

export const profile = atom<UserProfile | null>(null);

export interface User extends UserProfile {
  uid?: string;
  email?: string;
  role?: string;
  status?: string;
}

const user = atom<User | null>(null);
export default user;

export const setUser = (newUser: User) => {
  user.set({ ...user.get(), ...newUser });
};

// export const loadUser = action(user, 'loadUser', async () => {
// 	let u = null
// 	try {
// 		u = await appwrite.account.get()
// 	} catch {}
// 	user.set(u)

// 	localStorage.removeItem('jwt')
// 	localStorage.removeItem('jwtCreatedAt')

// 	if (u) {
// 		// load profile
// 		const p = await appwrite.database.getDocument('profiles', u.$id)
// 		profile.set(p as any)

// 		// load contacts and chats
// 		await loadChatRequests()
// 		await loadContacts()
// 		await getMessages()
// 	} else profile.set(null)

// 	keyPair.set(await checkKeys())
// })
