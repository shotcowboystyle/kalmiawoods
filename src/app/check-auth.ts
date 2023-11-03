import { auth } from '@/lib/lucia';

const PUBLIC_ROUTES = ['/maintenance', '/403', '/404', '/500', '/email', '/api'];
const AUTH_ROUTES = ['/auth/login', '/signup', '/auth/password-reset'];
const ACCOUNT_ROUTES = ['/auth/email-verification'];

export const checkAuth = async (context: any) => {
	const pathname = new URL(context.request.url).pathname;

	const authRequest = auth.handleRequest(context);

	if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
		return null;
	} else {
		const session = await authRequest.validate();
		const user = session?.user;
		if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
			if (session) {
				if (user && !user.emailVerified) {
					return '/auth/email-verification';
				}

				return '/';
			}
		} else if (ACCOUNT_ROUTES.some((route) => pathname.startsWith(route))) {
			if (session && user?.emailVerified) {
				return '/';
			}
		} else {
			if (!session) {
				return '/auth/login';
			}

			if (user && !user?.emailVerified) {
				return '/auth/email-verification';
			}

			const isAdmin = user?.role === 'ADMIN';
			if (user && Object.keys(user).length)
				context.locals.user = {
					userId: user.userId,
					email: user.email,
					isAdmin,
				};

			if (pathname.startsWith('/admin') && !isAdmin) {
				return '/403';
			}
		}
	}
};
