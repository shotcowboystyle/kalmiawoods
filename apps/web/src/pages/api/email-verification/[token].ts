import type { APIRoute } from 'astro';

import { auth } from '@/lib/lucia';
import { emailVerificationToken } from '@/services/verification-token';

export const post: APIRoute = async (context) => {
  const data = await context.request.json();
  const { password } = data;

  if (password === null || password.length < 8) {
    return new Response(JSON.stringify({ message: 'Invalid password' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const token = await emailVerificationToken.validate(context.params.token ?? '');
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
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'There was an error completing registration for this user. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
};
