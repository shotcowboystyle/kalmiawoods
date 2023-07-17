import type { APIRoute } from 'astro';

import { auth } from '@/lib/lucia';
import { getUser } from '@/services/user';

export const get: APIRoute = async (context) => {
  console.log('AUTH USER GET ONE');
  const authRequest = auth.handleRequest(context);
  console.log('AUTH USER GET TWO');
  const { user } = await authRequest.validateUser();
  console.log('AUTH USER GET Three', JSON.stringify(user));

  if (!user || !Object.keys(user).length) {
    return new Response(JSON.stringify(null), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const authUserWithProfile = await getUser(user.userId);
    return new Response(JSON.stringify(authUserWithProfile), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: 'An unknown error occurred' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
};
