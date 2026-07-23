import { NextResponse, type NextRequest } from "next/server";

import { ROLE_ROUTES } from "@repo/shared";
import { getRoleFromToken, USER_COOKIE_NAME } from "@/lib/auth-cookie";

function matchesRoute(pathname: string, routePath: string) {
  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get(USER_COOKIE_NAME)?.value;
  const role = await getRoleFromToken(authCookie);

  if (!role) {
    const response = NextResponse.redirect(new URL("/login", request.url));

    if (authCookie) {
      response.cookies.delete(USER_COOKIE_NAME);
    }

    return response;
  }

  const protectedRoute = ROLE_ROUTES.find((route) =>
    matchesRoute(pathname, route.path)
  );

  if (protectedRoute && !protectedRoute.roles.includes(role)) {
    return NextResponse.redirect(new URL("/crm", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/crm/:path*"],
};
