import type { APIRoute } from 'astro';

import { deleteUser, getUser } from '@/services/user';

export const get: APIRoute = async (context) => {
  const session = await context.locals.auth.validate();
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
    const { id } = context.params;
    const user = await getUser(id!);
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Something went wrong in api/users/[id] route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    });
  }
};

export const del: APIRoute = async (context) => {
  const { user, session } = await context.locals.auth.validateUser();
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

  const { id } = context.params;

  try {
    await deleteUser(id!);
    return new Response(JSON.stringify({ message: 'User successfully deleted.' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.log('error', error);
    return new Response(
      JSON.stringify({
        message: 'There was an error deleting this user. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
};
