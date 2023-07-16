import type { APIRoute } from 'astro';

import { auth } from '@/lib/lucia';
import { getUser, updateUserEmail } from '@/services/user';

export const put: APIRoute = async (context) => {
  const session = await context.locals.auth.validate();
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
  const { newEmail } = await context.request.json();

  try {
    await updateUserEmail(id!, newEmail);

    const user = await auth.getUser(id!);
    await auth.invalidateAllUserSessions(user.userId);

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
