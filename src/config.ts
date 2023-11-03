import { BASE_APP_URL } from '@/app/constants';

const BASE_PATH = BASE_APP_URL.replace(/\/$/, '');
const BASE_API_PATH = `${BASE_PATH}/api`;

export const route = (pathName?: string) => `${BASE_PATH}/${pathName ?? ''}`;
export const apiRoute = (pathName?: string) =>
	`${BASE_API_PATH}/${pathName ?? ''}`.replace(/\/$/, '');
