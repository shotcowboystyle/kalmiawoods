import type { APIRoute } from 'astro';

import { auth } from '@/lib/lucia';
import { validateEmailVerificationToken } from '@/services/verification-token';

export const prerender = false;

export const post: APIRoute = async (context) => {
  const { token } = context.params;
  if (!token) {
    return new Response(null, {
      status: 404,
    });
  }

  const data = await context.request.json();

  const { password } = data;
  if (password === null || password.length < 8) {
    return new Response(JSON.stringify({ message: 'Invalid password' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const userId = await validateEmailVerificationToken(token);
    const user = await auth.getUser(userId);
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateUserAttributes(user.userId, {
      email_verified: true,
    });
    await auth.updateKeyPassword('email', user.email, password);
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(context);
    authRequest.setSession(session);
    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Invalid email verification link',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
};
