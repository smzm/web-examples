/**
 * An array of routes that are accessible public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  '/',
  '/account/google',
  '/account/error',
  '/account/email/verify',
  '/account/password/forgot',
  '/account/password/reset',
  '/api/socket/direct-message',
];

/**
 * An array of routes that are used for authentication
 * These routes do not require authentication and redirect logged in users to DEFAULT_LOGIN_REDIRECT
 * @type {string[]}
 */
export const authRoutes = [
  '/account/login',
  '/account/signup',
  '/account/signup/email',
  '/account/signup/phonenumber',
  '/account/signup/completion',
  '/account/login/2fa',
];
export const DEFAULT_LOGIN_REDIRECT = '/';

/**
 * The prefix for API authentication routes
 * routes that start with prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after a successful login
 * @type {string}
 */
