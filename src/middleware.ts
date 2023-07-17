// import { defineMiddleware, sequence } from 'astro/middleware';

// import { auth } from '@/lib/lucia';

// const PUBLIC_ROUTES = ['/maintenance', '/403', '/404', '/500', '/email', '/api'];
// const AUTH_ROUTES = ['/auth/login', '/signup', '/auth/password-reset'];
// const ACCOUNT_ROUTES = ['/auth/email-verification'];

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
//   } else if (isAccountRoute(context.request.url) && session && user.emailVerified) {
//     return context.redirect('/');
//   } else {
//     if (!session) {
//       return context.redirect('/auth/login');
//     }

//     if (!user?.emailVerified) {
//       return context.redirect('/auth/email-verification');
//     }

//     const isAdmin = user.role === 'ADMIN';
//     context.locals.user = {
//       userId: user.userId,
//       email: user.email,
//       isAdmin,
//     };

//     if (url.pathname.startsWith('/admin') && !isAdmin) {
//       return context.redirect('/403');
//     }
//   }

//   return next();
// });

// export const onRequest = sequence(validationHandler);

import { auth } from "@/lib/lucia";

import type { MiddlewareResponseHandler } from "astro";

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
  const PUBLIC_ROUTES = ['/maintenance', '/403', '/404', '/500', '/email', '/api'];
  const AUTH_ROUTES = ['/auth/login', '/signup', '/auth/password-reset'];
  const ACCOUNT_ROUTES = ['/auth/email-verification'];

  const pathname = new URL(context.request.url).pathname;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    console.log('PUBLIC ROUTES');
    return await next();
  } else {
    const authRequest = auth.handleRequest(context);

    const { session, user } = await authRequest.validateUser();
    console.log('NON PUBLIC ROUTES', JSON.stringify(session), JSON.stringify(user));

    if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
      console.log('AUTH ROUTES ONE');
      if (session) {
        console.log('AUTH ROUTES TWO');
        if (!user.emailVerified) {
          console.log('AUTH ROUTES THREE');
          return context.redirect('/auth/email-verification');
        }

        return context.redirect('/');
      }
    } else if (ACCOUNT_ROUTES.some((route) => pathname.startsWith(route)) && session && user.emailVerified) {
      console.log('ACCOUNT ROUTES ONE');
      return context.redirect('/');
    } else {
      console.log('OTHER ROUTES ONE');
      if (!session) {
        console.log('OTHER ROUTES TWO');
        return context.redirect('/auth/login');
      }

      if (!user?.emailVerified) {
        console.log('OTHER ROUTES THREE');
        return context.redirect('/auth/email-verification');
      }

      const isAdmin = user.role === 'ADMIN';
      context.locals.user = {
        userId: user.userId,
        email: user.email,
        isAdmin,
      };

      if (pathname.startsWith('/admin') && !isAdmin) {
        console.log('OTHER ROUTES FOUR');
        return context.redirect('/403');
      }
    }
  }

  return await next();
};
