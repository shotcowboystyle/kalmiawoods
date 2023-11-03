import { auth } from '@/lib/lucia';
import { validatePasswordResetToken } from '@/services/verification-token';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
	const { token } = context.params;
	if (!token) {
		return new Response(null, {
			status: 404,
		});
	}

	const data = await context.request.json();

	const { password } = data;
	if (password instanceof File || password === null || password.length < 8) {
		return new Response(
			JSON.stringify({
				message: 'Invalid password',
			}),
			{
				status: 400,
				headers: { 'content-type': 'application/json' },
			},
		);
	}

	try {
		const userId = await validatePasswordResetToken(token);
		let user = await auth.getUser(userId);
		await auth.invalidateAllUserSessions(user.userId);
		await auth.updateKeyPassword('email', user.email, password);
		if (!user.emailVerified) {
			user = await auth.updateUserAttributes(user.userId, {
				email_verified: true,
			});
		}

		const session = await auth.createSession({ userId: user.userId, attributes: {} });
		const authRequest = auth.handleRequest(context);
		authRequest.setSession(session);

		return new Response(JSON.stringify({ message: 'Success' }), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (e) {
		return new Response(JSON.stringify({ message: 'An unknown error occurred' }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
};
