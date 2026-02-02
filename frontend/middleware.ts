import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Check for Better Auth session cookie
    const sessionCookie = request.cookies.get("better-auth.session_token");

    const pathname = request.nextUrl.pathname;

    // Public routes - accessible without authentication
    const isPublicRoute = pathname === "/" ||
                          pathname.startsWith("/login") ||
                          pathname.startsWith("/signup") ||
                          pathname.startsWith("/todo");

    // Protected routes - require authentication
    const isProtectedRoute = pathname.startsWith("/dashboard");

    // Redirect to login if not authenticated and trying to access protected route
    if (!sessionCookie && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to dashboard if authenticated and trying to access auth pages
    if (sessionCookie && (pathname === "/login" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
};
