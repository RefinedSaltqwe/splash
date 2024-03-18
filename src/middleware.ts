import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { publicRoutes } from "./routes";
import { env } from "./env";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: publicRoutes,
  // async beforeAuth(auth, req) {
  //   console.log("here 21");
  // },
  async afterAuth(auth, req) {
    //rewrite for domains
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    const hostname = req.headers;

    const pathWithSearchParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    //if subdomain exists
    const customSubDomain1 = hostname
      .get("host")
      ?.split(`${env.NEXT_PUBLIC_DOMAIN}`) // wwww.splashinnovations.ca
      .filter(Boolean)[0];

    const customSubDomain2 = hostname
      .get("host")
      ?.split(`${env.NEXT_PUBLIC_DOMAIN_NO_WWW}`) // splashinnovations.ca
      .filter(Boolean)[0];

    console.log(
      "=============================================",
      customSubDomain1 + " = " + customSubDomain2,
    );

    if (customSubDomain1) {
      console.log("in1: ", `/${customSubDomain1}${pathWithSearchParams}`);
      return NextResponse.rewrite(
        new URL(`/${customSubDomain1}${pathWithSearchParams}`, req.url),
      );
    } else if (customSubDomain2 && !customSubDomain2.includes("www.")) {
      console.log("in2: ", `/${customSubDomain2}${pathWithSearchParams}`);
      return NextResponse.rewrite(
        new URL(`/${customSubDomain2}${pathWithSearchParams}`, req.url),
      );
    }

    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/admin/sign-in`, req.url));
    }

    if (
      url.pathname === "/" ||
      (url.pathname === "/site" && url.host === env.NEXT_PUBLIC_DOMAIN)
    ) {
      return NextResponse.rewrite(new URL("/site", req.url));
    }

    if (
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/subaccount")
    ) {
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
