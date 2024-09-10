import authConfig from '@/app/lib/authentication/auth.config';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/app/lib/authentication/routes';
import NextAuth from 'next-auth';
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAPIAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAPIAuthRoute) {
    // if it's an API auth route, don't do anything
    return null;
  }

  if (isAuthRoute) {
    // if it's an auth route, redirect logged in users to DEFAULT_LOGIN_REDIRECT
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // if it's an auth route and the user is not logged in, don't do anything
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    // if it's not public route and the user is not logged in, redirect to login
    return Response.redirect(
      new URL(
        `/account/login?next=${encodeURIComponent(nextUrl.pathname)}`,
        nextUrl,
      ),
    );
  }

  // if it's a public route or the user is logged in, don't do anything
  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'], // on every route except .next
};
