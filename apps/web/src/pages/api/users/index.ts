import type { APIRoute } from 'astro';

import { createUser, getUsers } from '@/services/user';

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

export const post: APIRoute = async (context) => {
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

  const data = await context.request.json();

  try {
    const createdUser = await createUser(data);
    return new Response(JSON.stringify(createdUser), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'There was an error creating this user. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
};
