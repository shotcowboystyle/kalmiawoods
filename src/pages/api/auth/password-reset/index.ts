import type { APIRoute } from 'astro';

import { prisma } from '@/lib/db.js';
import { auth } from '@/lib/lucia';
import { sendPasswordResetEmail } from '@/services/email';
import { passwordResetToken } from '@/services/verification-token';
import { isValidEmail } from '@/utils/email';

export const post: APIRoute = async (context) => {
  const data = await context.request.json();
  const { email } = data;

  if (email === null || !isValidEmail(email)) {
    return new Response(
      JSON.stringify({
        message: 'Invalid email',
      }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      },
    );
  }

  try {
    const databaseUser = await prisma.authUser.findFirst({
      where: {
        email,
      },
    });

    if (!databaseUser) {
      return new Response(
        JSON.stringify({
          message: 'Email does not exist',
        }),
        {
          status: 404,
          headers: { 'content-type': 'application/json' },
        },
      );
    }

    const user = auth.transformDatabaseUser(databaseUser);
    const token = await passwordResetToken.issue(user.userId);
    await sendPasswordResetEmail(user.email, token.toString());
    return new Response(
      JSON.stringify({ message: 'An email was sent to your inbox with instructions to reset your password.' }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  } catch (e) {
    return new Response(JSON.stringify({ message: 'An unknown error occurred' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
};
