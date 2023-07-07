import type { APIRoute } from 'astro';

import { auth } from '@/auth/lucia';
import { isValidFormSubmission } from '@/auth/utils/forms/submission';
import { createUser, deleteUser, getUsers, updateUser } from '@/services/user';

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
    return new Response(JSON.stringify({ message: 'There was an error creating this user. Please try again later.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};

export const put: APIRoute = async (context) => {
  const validSubmission = isValidFormSubmission(context.request);
  if (!validSubmission) {
    return null;
  }

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

  const data = await context.request.json();

  try {
    const updatedUser = await updateUser(data);
    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'There was an error updating this profile. Please try again later.' }),
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
    await deleteUser(data.userId);
    return new Response(JSON.stringify({ message: 'User successfully deleted.' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'There was an error deleting this user. Please try again later.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
