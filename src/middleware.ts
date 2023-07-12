import { auth } from '@/lib/lucia';

import type { MiddlewareResponseHandler } from 'astro';

export const config = {
  runtime: 'serverless',
};

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
  context.locals.auth = auth.handleRequest(context);
  return await next();
};
