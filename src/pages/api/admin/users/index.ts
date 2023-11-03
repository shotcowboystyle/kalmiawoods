import { auth } from '@/lib/lucia';
import { createUser, getUsers } from '@/services/user';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
	const authRequest = auth.handleRequest(context);
	const session = await authRequest.validate();
	if (!session) {
		return new Response(
			JSON.stringify({
				message: 'Unauthorized',
			}),
			{
				status: 400,
			},
		);
	}

	try {
		const users = await getUsers();
		return new Response(JSON.stringify(users), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		return new Response(`Something went wrong in api/users route!: ${error as string}`, {
			status: 501,
			statusText: 'Server error',
		});
	}
};

export const POST: APIRoute = async (context) => {
	const authRequest = auth.handleRequest(context);
	const session = await authRequest.validate();
	if (!session) {
		return new Response(
			JSON.stringify({
				message: 'Unauthorized',
			}),
			{
				status: 400,
			},
		);
	}

	const { user } = session;
	if (!user || user.role !== 'ADMIN') {
		return new Response(
			JSON.stringify({
				message: 'Unauthorized',
			}),
			{
				status: 401,
			},
		);
	}

	const data = await context.request.json();

	try {
		const createdUser = await createUser(data);
		return new Response(JSON.stringify(createdUser), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error: Error) {
		return new Response(
			JSON.stringify({
				message: error.message ?? 'There was an error creating this user. Please try again later.',
			}),
			{
				status: 500,
				headers: { 'content-type': 'application/json' },
			},
		);
	}
};
