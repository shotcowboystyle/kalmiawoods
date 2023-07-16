import type { APIRoute } from 'astro';

import { auth } from '@/lib/lucia';
import { getUser, updateUserPassword } from '@/services/user';

export const put: APIRoute = async (context) => {
  const { session, user: sessionUser } = await context.locals.auth.validateUser();
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

  const { id } = context.params;
  const { newPassword } = await context.request.json();

  try {
    const user = await auth.getUser(id!);
    await auth.invalidateAllUserSessions(user.userId);

    await updateUserPassword(user.email, newPassword);

    if (sessionUser.userId === user.userId) {
      const session = await auth.createSession(user.userId);
      context.locals.auth.setSession(session);
    }

    const updatedUser = await getUser(user.userId);
    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'There was an error updating this user. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
};
