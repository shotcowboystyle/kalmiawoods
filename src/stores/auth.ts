import { RoleEnum as Role } from '@/schemas/auth';
import type { RoleEnum } from '@/types/Auth';
import { fetchGet, fetchPost } from '@/utils/fetchClient';
import { persistentMap } from '@nanostores/persistent';
import { useStore } from '@nanostores/vue';
import { action } from 'nanostores';

type StoreAuthUser = {
	isLoading: boolean;
	userId: string;
	email: string;
	role: RoleEnum;
	isAdmin: boolean;
	name: string;
	avatar: string;
};

const initAuthUser = {
	isLoading: false,
	userId: '',
	email: '',
	role: Role.enum.USER,
	isAdmin: false,
	name: '',
	avatar: '',
};

const authUser = persistentMap<StoreAuthUser>('authUser:', initAuthUser, {
	encode(value) {
		return JSON.stringify(value);
	},
	decode(value) {
		if (value !== '') {
			return JSON.parse(value);
		}
		return value;
	},
});
export const $authUser = useStore(authUser);

type LoginData = {
	email: string;
	password: string;
};

export const login = action(authUser, 'login', async (user, loginData: LoginData) => {
	user.setKey('isLoading', true);

	try {
		await fetchPost('auth', loginData);

		const data = await fetchGet('auth');
		const authUserData = {
			userId: data.userId,
			email: data.email,
			role: data.role,
			isAdmin: data.role === Role.enum.ADMIN,
			name: `${data.firstName} ${data.lastName}`,
			avatar: data.avatar,
		};

		return user.set({ isLoading: false, ...authUserData });
	} catch (error: any) {
		throw new Error(error);
	}
});

export const logout = action(authUser, 'logout', async (user) => {
	try {
		await fetchPost('auth/logout', {});
		user.set(initAuthUser);
		location.href = '/auth/login';
	} catch (error: any) {
		throw new Error(error);
	}
});
