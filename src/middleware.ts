import type { MiddlewareHandler } from 'astro';
import { sessionCookieName, validateSession } from './lib/auth';

/**
 * Reachable without a session. `/admin/offline` is the service worker's
 * fallback shell and is prerendered — the guard would otherwise turn its
 * build-time render into a redirect to the login page.
 */
const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/admin/offline']);

export const onRequest: MiddlewareHandler = async (context, next) => {
	const { pathname } = context.url;

	// `pathname === '/admin' || startsWith('/admin/')` rather than
	// `startsWith('/admin')`, which also matches siblings like
	// `/admin.webmanifest` or `/admin-something` and would redirect them.
	const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

	if (!isAdminRoute || PUBLIC_ADMIN_PATHS.has(pathname)) {
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

	if (user.mustChangePassword && pathname !== '/admin/account' && pathname !== '/admin/logout') {
		return context.redirect('/admin/account?force=1');
	}

	return next();
};
