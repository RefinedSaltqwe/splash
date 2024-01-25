import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/admin/auth", request.url));
}

/* 
  See "Matching Paths" below to learn more
  Not allowed paths
*/
export const config = {
  matcher: ["/admin", "/admin/employees", "/admin/expense"],
};
