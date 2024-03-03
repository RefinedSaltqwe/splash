/**
 * An Array of routes are accessible to the public
 * These routes do not require authentication
 */
export const publicRoutes = [
  "/",
  "/site",
  "/api/uploadthing",
  "/admin/sign-in",
];
/**
 * An Array of routes are not accessible to the public
 * These routes do not require authentication
 */
export const privateRoutes = ["/admin"];

/**
 * An Array of routes that are used for authentication
 * These routes will redirect logged in users to dashboard
 */
export const authRoutes = ["/admin/auth", "/admin/auth/registration"];
/**
 * The prefix for API authentication routes
 * Routes that starts with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";
/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/admin/dashboard";
