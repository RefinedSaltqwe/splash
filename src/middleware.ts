import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
  publicRoutes,
} from "@/routes";
import { type User } from "next-auth";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";

type session = object | User;

export async function middleware(request: NextRequest) {
  const headersList = headers();
  const cookieHeader = headersList.get("cookie");
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // get user session
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const session: session = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/session`,
    {
      headers: {
        cookie: cookieHeader ? cookieHeader : "",
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  ).then(async (res: Response) => await res.json());

  const isLoggedIn = Object.keys(session).length > 0 ? true : false;

  // Never protect this route
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPrivateRoute = privateRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  if (isApiAuthRoute) {
    return null;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }
  if (!isLoggedIn && !isPublicRoute) {
    console.log("Middleware: Not in public route");
    return Response.redirect(new URL("/admin/auth", nextUrl));
  }
  if (isPrivateRoute && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }
  return null;
}

/* 
  All paths will invoke middleware
*/
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
