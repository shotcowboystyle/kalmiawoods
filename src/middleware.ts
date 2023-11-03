import { auth } from '@/lib/lucia';
import type { MiddlewareResponseHandler } from 'astro';

const PUBLIC_ROUTES = [
	'/maintenance',
	'/403',
	'/404',
	'/500',
	'/__email',
	'/email',
	'/api',
	'/_image',
];
const AUTH_ROUTES = ['/auth/login', '/signup', '/auth/password-reset'];
const ACCOUNT_ROUTES = ['/auth/email-verification'];

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
	context.locals.auth = auth.handleRequest(context);

	const pathname = new URL(context.request.url).pathname;

	if (pathname === '/' || PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
		return await next();
	} else {
		const session = await context.locals.auth.validate();
		const user = session?.user;
		if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
			if (session) {
				if (user && !user.emailVerified) {
					return context.redirect('/auth/email-verification');
				}

				return context.redirect('/dashboard');
			}
		} else if (ACCOUNT_ROUTES.some((route) => pathname.startsWith(route))) {
			if (session && user?.emailVerified) {
				return context.redirect('/dashboard');
			}
		} else {
			if (!session) {
				return context.redirect('/auth/login');
			}

			if (user && !user?.emailVerified) {
				return context.redirect('/auth/email-verification');
			}

			const isAdmin = user?.role === 'ADMIN';
			if (user && Object.keys(user).length)
				context.locals.user = {
					userId: user.userId,
					email: user.email,
					isAdmin,
				};

			if (pathname.startsWith('/admin') && !isAdmin) {
				return context.redirect('/403');
			}
		}
	}

	return await next();
};
