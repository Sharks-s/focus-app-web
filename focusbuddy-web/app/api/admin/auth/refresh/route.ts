import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    fetchBackend,
    getSetCookies,
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    accessCookieOptions,
} from "@/lib/serverFetch";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    const beRes = await fetchBackend("/auth/refresh", {
        method: "POST",
        headers: refreshToken ? { Cookie: `${REFRESH_COOKIE}=${refreshToken}` } : {},
    });

    const json = await beRes.json().catch(() => null);

    if (!beRes.ok || !json?.success) {
        const response = NextResponse.json({ success: false }, { status: 401 });
        response.cookies.delete(ACCESS_COOKIE);
        response.cookies.delete(REFRESH_COOKIE);
        return response;
    }

    const { accessToken } = json.data;
    const response = NextResponse.json({ success: true });

    getSetCookies(beRes).forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
    });

    response.cookies.set(ACCESS_COOKIE, accessToken, accessCookieOptions());

    return response;
}