import type { APIRoute } from 'astro';
import { LuciaError } from 'lucia-auth';

import { auth } from '@/auth/lucia';
import { emailRegex, isValidFormSubmission } from '@/auth/utils/forms/submission';
import { DASHBOARD_HOME } from '@/constants';

export const post: APIRoute = async (context) => {
  const validSubmission = isValidFormSubmission(context.request);
  if (!validSubmission) {
    return null;
  }

  const authRequest = auth.handleRequest(context);

  const genericErrorMessage = 'Incorrect email or password';
  const formData = await context.request.formData();
  const email = formData.get('email')?.toString() ?? '';
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

  const password = formData.get('password');
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
    authRequest.setSession(session);
    return context.redirect(DASHBOARD_HOME, 302);
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
