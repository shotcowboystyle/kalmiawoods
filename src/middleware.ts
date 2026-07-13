import type { MiddlewareHandler } from 'astro';

import { sessionCookieName, validateSession } from './lib/auth';

export const onRequest: MiddlewareHandler = async (context, next) => {
	const { pathname } = context.url;

	// Only guard /admin routes (except login)
	if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
		return next();
	}

	const token = context.cookies.get(sessionCookieName())?.value;
	if (!token) {
		return context.redirect('/admin/login');
	}

	const user = await validateSession(token);
	if (!user) {
		context.cookies.delete(sessionCookieName(), { path: '/' });
		return context.redirect('/admin/login');
	}

	context.locals.user = user;

	if (pathname.startsWith('/admin/users') && user.role !== 'super_admin') {
		return context.redirect('/admin');
	}

	if (
		user.mustChangePassword &&
		pathname !== '/admin/account' &&
		pathname !== '/admin/logout'
	) {
		return context.redirect('/admin/account?force=1');
	}

	return next();
};
