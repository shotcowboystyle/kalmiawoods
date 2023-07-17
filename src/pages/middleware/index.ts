// import { defineMiddleware, sequence } from 'astro/middleware';
import { defineMiddleware } from 'astro/middleware';

import { auth } from '@/lib/lucia';

// export const PUBLIC_ROUTES = ['/maintenance', '/403', '/404', '/500', '/email'];
// export const AUTH_ROUTES = ['/auth/login', '/signup', '/auth/password-reset'];
// export const ACCOUNT_ROUTES = ['/auth/email-verification'];

// export const config = {
//   runtime: 'serverless',
// };

// function skipMiddleware(url: string) {
//   let shouldSkip = false;
//   const pathname = new URL(url).pathname;

//   for (const route of PUBLIC_ROUTES) {
//     if (pathname.startsWith(route)) {
//       shouldSkip = true;
//       break;
//     }
//   }

//   return shouldSkip;
// }

// function isAuthRoute(url: string) {
//   let isRoute = false;
//   const pathname = new URL(url).pathname;

//   for (const route of AUTH_ROUTES) {
//     if (pathname.startsWith(route)) {
//       isRoute = true;
//       break;
//     }
//   }

//   return isRoute;
// }

// function isAccountRoute(url: string) {
//   let isRoute = false;
//   const pathname = new URL(url).pathname;

//   for (const route of ACCOUNT_ROUTES) {
//     if (pathname.startsWith(route)) {
//       isRoute = true;
//       break;
//     }
//   }

//   return isRoute;
// }

// const validationHandler = defineMiddleware(async (context, next): Promise<Response> => {
//   const url = new URL(context.request.url);

//   if (skipMiddleware(context.request.url)) {
//     return next();
//   }

//   const authRequest = auth.handleRequest(context);

//   const { session, user } = await authRequest.validateUser();

//   if (isAuthRoute(context.request.url)) {
//     if (session) {
//       if (!user.emailVerified) {
//         return context.redirect('/auth/email-verification');
//       }

//       return context.redirect('/');
//     }
//   }

//   if (isAccountRoute(context.request.url) && session && user.emailVerified) {
//     return context.redirect('/');
//   }

//   if (!session) {
//     return context.redirect('/auth/login');
//   }

//   const isAdmin = user.role === 'ADMIN';
//   context.locals.user = {
//     userId: user.userId,
//     email: user.email,
//     isAdmin,
//   };

//   if (!user?.emailVerified) {
//     return context.redirect('/auth/email-verification');
//   }

//   if (url.pathname.startsWith('/admin') && !isAdmin) {
//     return context.redirect('/403');
//   }

//   return next();
// });

// export const onRequest = sequence(validationHandler);

// export const onRequest: MiddlewareResponseHandler = async (context, next) => {
export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.auth = auth.handleRequest(context);
  return next();
});
