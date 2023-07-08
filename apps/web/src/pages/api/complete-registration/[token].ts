import type { APIRoute } from 'astro';

import { auth, completeRegistrationToken } from '@/auth/lucia';
import { isValidFormSubmission } from '@/auth/utils/forms/submission';

export const post: APIRoute = async (context) => {
  const validSubmission = isValidFormSubmission(context.request);
  if (!validSubmission) {
    return new Response(null, {
      status: 403,
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
    const token = await completeRegistrationToken.validate(context.params.token ?? '');
    let user = await auth.getUser(token.userId);
    if (!user.emailVerified) {
      user = await auth.updateUserAttributes(user.userId, {
        email_verified: true,
        status: 'REGISTERED',
      });
    }
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateKeyPassword('email', user.email, password);
    const session = await auth.createSession(user.userId);
    const authRequest = auth.handleRequest(context);
    authRequest.setSession(session);
    return new Response(JSON.stringify({ message: 'Success' }), {
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
