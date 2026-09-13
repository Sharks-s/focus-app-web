import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    fetchBackend,
    getSetCookies,
    ACCESS_COOKIE,
    REFRESH_COOKIE,
} from "@/lib/serverFetch";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    const beRes = await fetchBackend("/auth/logout", {
        method: "POST",
        headers: refreshToken ? { Cookie: `${REFRESH_COOKIE}=${refreshToken}` } : {},
    });

    const response = NextResponse.json({ success: true });

    getSetCookies(beRes).forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
    });

    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);

    return response;
}