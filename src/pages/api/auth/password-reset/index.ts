import { prismaClient } from '@/lib/db.js';
import { auth } from '@/lib/lucia';
import { sendPasswordResetEmail } from '@/services/email';
import { generatePasswordResetToken } from '@/services/verification-token';
import { isValidEmail } from '@/utils/email';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async (context) => {
	const data = await context.request.json();
	const { email } = data;

	if (email === null || !isValidEmail(email)) {
		return new Response(
			JSON.stringify({
				message: 'Invalid email',
			}),
			{
				status: 400,
				headers: { 'content-type': 'application/json' },
			},
		);
	}

	try {
		const databaseUser = await prismaClient.user.findFirst({
			where: {
				email,
			},
		});

		if (!databaseUser) {
			return new Response(
				JSON.stringify({
					message: 'Email does not exist',
				}),
				{
					status: 404,
					headers: { 'content-type': 'application/json' },
				},
			);
		}

		const user = auth.transformDatabaseUser(databaseUser);
		const token = await generatePasswordResetToken(user.userId);
		await sendPasswordResetEmail(user.email, token.toString());
		return new Response(
			JSON.stringify({
				message: 'An email was sent to your inbox with instructions to reset your password.',
			}),
			{
				status: 200,
				headers: { 'content-type': 'application/json' },
			},
		);
	} catch (e) {
		return new Response(JSON.stringify({ message: 'An unknown error occurred' }), {
			status: 400,
			headers: { 'content-type': 'application/json' },
		});
	}
};
