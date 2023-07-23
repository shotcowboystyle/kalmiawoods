import { auth } from '@/lib/lucia';

import type { APIRoute } from 'astro';

export const post: APIRoute = async (context) => {
  try {
    const authRequest = auth.handleRequest(context);
    const session = await authRequest.validate();
    if (!session) {
      return new Response('Not authenticated', {
        status: 401,
      });
    }

    // make sure to invalidate the current session!
    await auth.invalidateSession(session.sessionId);
    // delete session cookie
    authRequest.setSession(null);
    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 302,
      headers: {
        location: '/auth/login',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 302,
      headers: {
        location: '/auth/login',
      },
    });
  }
};
