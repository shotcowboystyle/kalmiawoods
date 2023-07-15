import type { APIRoute } from 'astro';

import { auth } from '@/lib/lucia';
import { deleteUser, getUser, updateUserEmail, updateUserPassword, updateUserProfile } from '@/services/user';
import { emailVerificationToken } from '@/services/verification-token';

export const get: APIRoute = async (context) => {
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

  try {
    const { id } = context.params;
    const user = await getUser(id!);
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Something went wrong in api/users/[id] route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    });
  }
};

export const post: APIRoute = async (context) => {
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
    return context.redirect('/', 302);
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
  const data = await context.request.json();

  const { updateUserType } = data;

  if (updateUserType.endsWith('CREDENTIALS')) {
    const { newEmail, newPassword } = data;
    try {
      const user = await auth.getUser(id!);
      await auth.invalidateAllUserSessions(user.userId);

      if (updateUserType === 'SECURITY_CREDENTIALS') {
        await updateUserPassword(user.email, newPassword);
      } else if (updateUserType === 'AUTH_CREDENTIALS') {
        await updateUserEmail(user.userId, newEmail);
      }

      const session = await auth.createSession(user.userId);
      context.locals.auth.setSession(session);

      const updatedUser = await getUser(user.userId);
      return new Response(JSON.stringify(updatedUser), {
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
  } else if (updateUserType === 'PROFILE') {
    try {
      const updatedUserProfile = await updateUserProfile(id!, data);
      return new Response(JSON.stringify(updatedUserProfile), {
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
  } else {
    return new Response(null, { status: 501 });
  }
};

export const del: APIRoute = async (context) => {
  const { user, session } = await context.locals.auth.validateUser();
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

  if (!user || user.role !== 'ADMIN') {
    return new Response(
      JSON.stringify({
        message: 'Unauthorized',
      }),
      {
        status: 401,
      },
    );
  }

  const { id } = context.params;

  try {
    await deleteUser(id!);
    return new Response(JSON.stringify({ message: 'User successfully deleted.' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.log('error', error)
    return new Response(
      JSON.stringify({
        message: 'There was an error deleting this user. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
};
