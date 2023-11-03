import { auth } from '@/lib/lucia';
import { createReservation, getReservations } from '@/services/reservation';
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
		const { searchParams } = context.url;
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');
		const reservations = await getReservations({ startDate, endDate });

		return new Response(JSON.stringify(reservations), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		return new Response(`Something went wrong in api/reservations route!: ${error as string}`, {
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

	const user = session.user;
	const data = await context.request.json();
	const payload = {
		title: data.title,
		buildings: data.buildings,
		checkInDate: data.range.start,
		checkOutDate: data.range.end,
		userId: data.userId ?? user.userId,
	};

	try {
		const createdReservation = await createReservation(payload);
		return new Response(JSON.stringify(createdReservation), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: 'There was an error creating this reservation. Please try again later.',
			}),
			{
				status: 500,
				headers: { 'content-type': 'application/json' },
			},
		);
	}
};
