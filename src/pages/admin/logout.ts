import type { APIRoute } from 'astro';

import { deleteSession, sessionCookieName } from '../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
	const token = cookies.get(sessionCookieName())?.value;
	if (token) {
		await deleteSession(token);
	}
	cookies.delete(sessionCookieName(), { path: '/' });
	return redirect('/admin/login');
};
