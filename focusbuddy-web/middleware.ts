import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("admin_access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;
    const hasSession = !!accessToken || !!refreshToken;

    const { pathname } = request.nextUrl;

    const isLoginPage = pathname.startsWith("/admin/login");
    const isAdminRoute = pathname.startsWith("/admin") && !isLoginPage;

    // Không còn access token lẫn refresh token -> chắc chắn chưa login / hết phiên thật sự
    if (isAdminRoute && !hasSession) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Đã có phiên (access hoặc refresh còn) mà cố vào trang login -> đá vào dashboard
    if (isLoginPage && hasSession) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};