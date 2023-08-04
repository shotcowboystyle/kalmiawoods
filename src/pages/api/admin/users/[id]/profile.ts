import type { APIRoute } from 'astro';

import { auth } from '@/lib/lucia';
import { getUserProfile, updateUserProfile } from '@/services/user-profile';

export const prerender = false;

export const get: APIRoute = async (context) => {
  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validate();
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

  const { profileId } = await context.request.json();

  try {
    const userProfile = await getUserProfile(profileId);
    return new Response(JSON.stringify(userProfile), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Something went wrong in api/users/[id]/profile route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    });
  }
};

export const put: APIRoute = async (context) => {
  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validate();
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

  const { profileData, userId } = await context.request.json();

  try {
    const updatedUserProfile = await updateUserProfile(userId, profileData);
    return new Response(JSON.stringify(updatedUserProfile), {
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
