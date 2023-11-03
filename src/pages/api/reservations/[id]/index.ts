import { auth } from '@/lib/lucia';
import { deleteReservation, updateReservation } from '@/services/reservation';
import type { APIRoute } from 'astro';

export const PUT: APIRoute = async (context) => {
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

	const { id } = context.params;
	const data = await context.request.json();
	const payload = {
		reservationId: id!,
		title: data.title,
		buildings: data.buildings,
		checkInDate: data.range.start,
		checkOutDate: data.range.end,
	};

	try {
		const updatedReservation = await updateReservation(payload);
		return new Response(JSON.stringify(updatedReservation), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: 'There was an error updating this reservation. Please try again later.',
			}),
			{
				status: 500,
				headers: { 'content-type': 'application/json' },
			},
		);
	}
};

export const DEL: APIRoute = async (context) => {
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

	const { id } = context.params;

	try {
		await deleteReservation(id!);
		return new Response(JSON.stringify({ message: 'Reservation successfully deleted.' }), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: 'There was an error deleting this reservation. Please try again later.',
			}),
			{
				status: 500,
				headers: { 'content-type': 'application/json' },
			},
		);
	}
};
