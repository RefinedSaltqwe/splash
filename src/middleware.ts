import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // if (request.nextUrl.pathname.startsWith("/admin")) {
  //   return NextResponse.rewrite(new URL("/admin/auth", request.url));
  // }
  // if (request.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.rewrite(new URL("/dashboard/user", request.url));
  // }
}
