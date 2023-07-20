import type { APIRoute } from 'astro';

import { auth } from '@/lib/lucia';

export const post: APIRoute = async (context) => {
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
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
};
