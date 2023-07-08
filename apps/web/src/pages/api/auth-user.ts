import type { APIRoute } from 'astro'

import { auth } from '@/auth/lucia'
import { getUser } from '@/services/user'

export const get: APIRoute = async (context) => {
  const authRequest = auth.handleRequest(context)
  const { user } = await authRequest.validateUser()

  if (!user || !Object.keys(user).length) {
    return new Response(JSON.stringify(null), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    })
  }

  try {
    const authUserWithProfile = await getUser(user.userId)
    return new Response(JSON.stringify(authUserWithProfile), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
  } catch (e) {
    console.log('ERROR', error)
    return new Response(
      JSON.stringify({ message: 'An unknown error occurred' }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' }
      }
    )
  }
}
