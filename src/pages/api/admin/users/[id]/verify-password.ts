import { auth } from '@/lib/lucia';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
	const authRequest = auth.handleRequest(context);
	const session = await authRequest.validate();
	if (!session) {
		return new Response(
			JSON.stringify({
				message: 'Unauthorized',
			}),
			{
				status: 403,
			},
		);
	}

	const { email, currentPassword } = await context.request.json();

	try {
		const key = await auth.useKey('email', email, currentPassword);
		return new Response(JSON.stringify(key), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch {
		return new Response(
			JSON.stringify({
				message: 'Incorrect password.',
			}),
			{
				status: 400,
			},
		);
	}
};
