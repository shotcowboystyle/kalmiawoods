import type { APIRoute } from 'astro';

import { auth } from '@/lib/lucia';
import { passwordResetToken } from '@/services/verification-token';

export const post: APIRoute = async (context) => {
  const data = await context.request.json();
  const { password } = data;

  if (password instanceof File || password === null || password.length < 8) {
    return new Response(
      JSON.stringify({
        message: 'Invalid password',
      }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      },
    );
  }

  try {
    const token = await passwordResetToken.validate(context.params.token ?? '');
    let user = await auth.getUser(token.userId);
    if (!user.emailVerified) {
      user = await auth.updateUserAttributes(user.userId, {
        email_verified: true,
      });
    }
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateKeyPassword('email', user.email, password);
    const session = await auth.createSession(user.userId);
    context.locals.auth.setSession(session);
    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: 'An unknown error occurred' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
