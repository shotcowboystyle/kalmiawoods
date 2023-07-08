import type { APIRoute } from 'astro';

import { auth } from '@/auth/lucia';
import { isValidFormSubmission } from '@/auth/utils/forms/submission';
import { createReservation, deleteReservation, getReservations, updateReservation } from '@/services/reservation';

export const get: APIRoute = async (context) => {
  const authRequest = auth.handleRequest(context);
  const { session } = await authRequest.validateUser();
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

export const post: APIRoute = async (context) => {
  const validSubmission = isValidFormSubmission(context.request);
  if (!validSubmission) {
    return null;
  }

  const authRequest = auth.handleRequest(context);
  const { user, session } = await authRequest.validateUser();
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

  const data = await context.request.json();
  const payload = {
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

export const put: APIRoute = async (context) => {
  const validSubmission = isValidFormSubmission(context.request);
  if (!validSubmission) {
    return null;
  }

  const authRequest = auth.handleRequest(context);
  const { user, session } = await authRequest.validateUser();
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

  const data = await context.request.json();
  const payload = {
    reservationId: data.reservationId,
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

export const del: APIRoute = async (context) => {
  const authRequest = auth.handleRequest(context);
  const { user, session } = await authRequest.validateUser();
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

  const data = await context.request.json();

  try {
    await deleteReservation(data.reservationId);
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
