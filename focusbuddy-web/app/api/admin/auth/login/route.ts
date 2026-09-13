import { NextResponse } from "next/server";
import {
    fetchBackend,
    getSetCookies,
    ACCESS_COOKIE,
    accessCookieOptions,
} from "@/lib/serverFetch";

export async function POST(request: Request) {
    const body = await request.json();

    const beRes = await fetchBackend("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
    });

    const json = await beRes.json();

    if (!beRes.ok || !json.success) {
        return NextResponse.json(
            {
                success: false,
                message: json.message ?? "Đăng nhập thất bại",
            },
            { status: beRes.status },
        );
    }

    // Khớp LoginResponse: { accessToken, tokenType, user }
    const { accessToken, user } = json.data;

    const response = NextResponse.json({
        success: true,
        data: { user },
    });

    // 1. Set access token trước
    response.cookies.set(
        ACCESS_COOKIE,
        accessToken,
        accessCookieOptions(),
    );

    // 2. Forward refresh token từ Backend sau cùng
    getSetCookies(beRes).forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
    });

    return response;
}