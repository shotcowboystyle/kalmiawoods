// import { defineMiddleware, sequence } from 'astro/middleware';
import type { MiddlewareResponseHandler } from 'astro';

import { auth } from '@/lib/lucia';
// import { publicRoutes } from '@/app/constants';

export const config = {
  runtime: 'serverless',
};

// function skipMiddleware(url: string) {
//   let shouldSkip = false;
//   const pathname = new URL(url).pathname;

//   for (const route of publicRoutes) {
//     if (pathname.startsWith(route)) {
//       shouldSkip = true;
//       break;
//     }
//   }

//   return shouldSkip;
// }

// const validation = defineMiddleware(async (context, next) => {
// 	if (context.request.url.endsWith('/admin')) {
// 		if (loginInfo.currentTime) {
// 			const difference = new Date().getTime() - loginInfo.currentTime;
// 			if (difference > limit) {
// 				console.log('hit threshold');
// 				loginInfo.token = undefined;
// 				loginInfo.currentTime = undefined;
// 				return context.redirect('/login');
// 			}
// 		}
// 		// we naively check if we have a token
// 		if (loginInfo.token && loginInfo.token === 'loggedIn') {
// 			// we fill the locals with user-facing information
// 			context.locals.user = {
// 				name: 'AstroUser',
// 				surname: 'AstroSurname',
// 			};
// 			return await next();
// 		} else {
// 			loginInfo.token = undefined;
// 			loginInfo.currentTime = undefined;
// 			return context.redirect('/login');
// 		}
// 	} else if (context.request.url.endsWith('/api/login')) {
// 		const response = await next();
// 		// the login endpoint will return to us a JSON with username and password
// 		const data = await response.json();
// 		// we naively check if username and password are equals to some string
// 		if (data.username === 'astro' && data.password === 'astro') {
// 			// we store the token somewhere outside of locals because the `locals` object is attached to the request
// 			// and when doing a redirect, we lose that information
// 			loginInfo.token = 'loggedIn';
// 			loginInfo.currentTime = new Date().getTime();
// 			return context.redirect('/admin');
// 		}
// 	}
// 	return next();
// });

// const authorizationHandler: MiddlewareResponseHandler = async (
//   { request, redirect },
//   next,
// ): Promise<Response> => {
//   const url = new URL(request.url);

//   if (skipMiddleware(request.url)) {
//     return next();
//   }

//   const pathnameIsMissingLocale = supportedLocales.every(
//     (locale) =>
//       !url.pathname.startsWith(`/${locale}/`) && url.pathname !== `/${locale}`,
//   );

//   if (pathnameIsMissingLocale) {
//     const locale = getLanguageFromAcceptLanguage(
//       request.headers.get(`accept-language`) || ``,
//     );

//     const normalizedPathname = normalizePathname(`/${locale}/${url.pathname}`);

//     const nextUrl = new URL(normalizedPathname, request.url).toString();

//     return redirect(nextUrl);
//   }

//   return next();
// };

// export const onRequest = sequence(languageHandler, themeHintHandler);

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
  context.locals.auth = auth.handleRequest(context);
  return await next();
};

// export const onRequest = defineMiddleware(async (context, next) => {
//   if (context.request.headers.get('edgio') !== getENV('EDGIO_HEADER')) {
//     return new Response(null, {
//       status: 403,
//     })
//   }
//   const response = await next()
//   return new Response(response.body, {
//     status: response.status,
//     headers: response.headers,
//   })
// })

// export const onRequest = defineMiddleware(async (context, next) => {
//   const bearerToken: string | null | undefined = context.request.headers.get("authorization");

//   if (context.request.url.includes("/internal")) {
//     return next();
//   }

//   if (!bearerToken) {
//     console.info("Could not find any bearer token on the request. Redirecting to login.");
//     return context.redirect(`/minside-beta/oauth2/login?redirect=${redirectUri}`);
//   }

//   const validationResult = await validateIdportenToken(bearerToken);

//   if (validationResult !== "valid") {
//     const error = new Error(`Invalid JWT token found (cause: ${validationResult.errorType} ${validationResult.message}, redirecting to login.`);
//     console.error(error);
//     return context.redirect(`/minside-beta/oauth2/login?redirect=${redirectUri}`);
//   }

//   return next();
// });
