import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    fetchBackend,
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    accessCookieOptions,
} from "@/lib/serverFetch";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (!refreshToken) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    const beRes = await fetchBackend("/auth/exchange", {
        method: "POST",
        headers: { Cookie: `${REFRESH_COOKIE}=${refreshToken}` },
    });

    const json = await beRes.json().catch(() => null);

    if (!beRes.ok || !json?.success) {
        const response = NextResponse.json({ success: false }, { status: 401 });
        response.cookies.delete(ACCESS_COOKIE);
        response.cookies.delete(REFRESH_COOKIE);
        return response;
    }

    const { accessToken, user } = json.data;
    const response = NextResponse.json({ success: true, data: { user } });

    response.cookies.set(ACCESS_COOKIE, accessToken, accessCookieOptions());

    return response;
}