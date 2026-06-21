
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


const protectedRoutes = ["/dashboard"];

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;

    const { pathname } = req.nextUrl;

    // If trying to access a protected route without token → redirect to login
    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !accessToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If logged in and trying to access login page → redirect to dashboard
    if (pathname === "/login" && accessToken) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Otherwise, continue
    return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};
