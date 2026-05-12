import { NextResponse, type NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                     request.nextUrl.pathname.startsWith("/signup") ||
                     request.nextUrl.pathname.startsWith("/forgot-password") ||
                     request.nextUrl.pathname.startsWith("/reset-password");

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard") || 
                           request.nextUrl.pathname.startsWith("/admin") || 
                           request.nextUrl.pathname.startsWith("/enrollment");

  if (!session) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/admin/:path*", 
    "/enrollment/:path*", 
    "/login", 
    "/signup",
    "/forgot-password",
    "/reset-password"
  ],
};
