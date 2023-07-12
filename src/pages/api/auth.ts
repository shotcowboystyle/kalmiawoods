import type { APIRoute } from 'astro';
import { LuciaError } from 'lucia-auth';

import { auth } from '@/lib/lucia';
import { emailRegex } from '@/utils/email';

export const post: APIRoute = async (context) => {
  const genericErrorMessage = 'Incorrect email or password';
  const data = await context.request.json();
  const { email, password } = data;

  if (email === null || !emailRegex.test(email)) {
    return new Response(
      JSON.stringify({
        message: genericErrorMessage,
      }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      },
    );
  }

  if (password instanceof File || password === null) {
    return new Response(
      JSON.stringify({
        message: genericErrorMessage,
      }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      },
    );
  }

  try {
    const key = await auth.useKey('email', email, password);
    const session = await auth.createSession(key.userId);
    context.locals.auth.setSession(session);
    return new Response(JSON.stringify({ userId: key.userId }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    let message = '';
    if (e instanceof LuciaError && e.message === 'AUTH_INVALID_KEY_ID') {
      message = 'Incorrect email or password';
    } else if (e instanceof LuciaError && e.message === 'AUTH_INVALID_PASSWORD') {
      message = 'Incorrect email or password';
    } else {
      message = 'An unknown error occurred';
    }

    return new Response(JSON.stringify({ message }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
};
