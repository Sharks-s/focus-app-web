import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    fetchBackend,
    getSetCookies,
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    accessCookieOptions,
} from "@/lib/serverFetch";

async function proxy(request: Request, path: string[]) {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    const url = new URL(request.url);
    const targetPath = "/" + path.join("/") + url.search;
    const method = request.method;
    const body =
        method !== "GET" && method !== "HEAD" ? await request.text() : undefined;

    async function callBackend(token?: string) {
        return fetchBackend(targetPath, {
            method,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body,
        });
    }

    let beRes = await callBackend(accessToken);

    // Access token hết hạn -> thử refresh đúng 1 lần
    if (beRes.status === 401 &&
        refreshToken &&
        !targetPath.startsWith("/auth/")) {
        const refreshRes = await fetchBackend("/auth/refresh", {
            method: "POST",
            headers: { Cookie: `${REFRESH_COOKIE}=${refreshToken}` },
        });
        const refreshJson = await refreshRes.json().catch(() => null);

        if (refreshRes.ok && refreshJson?.success) {
            accessToken = refreshJson.data.accessToken;
            beRes = await callBackend(accessToken);

            const data = await beRes.json().catch(() => null);
            const response = NextResponse.json(data, { status: beRes.status });

            getSetCookies(refreshRes).forEach((cookie) => {
                response.headers.append("Set-Cookie", cookie);
            });
            response.cookies.set(ACCESS_COOKIE, accessToken!, accessCookieOptions());

            return response;
        }

        // Refresh cũng fail -> clear cookie, để client tự redirect về login
        const response = NextResponse.json(
            { success: false, message: "SESSION_EXPIRED" },
            { status: 401 },
        );
        response.cookies.delete(ACCESS_COOKIE);
        response.cookies.delete(REFRESH_COOKIE);
        return response;
    }

    const data = await beRes.json().catch(() => null);
    return NextResponse.json(data, { status: beRes.status });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, { params }: Ctx) {
    return proxy(request, (await params).path);
}
export async function POST(request: Request, { params }: Ctx) {
    return proxy(request, (await params).path);
}
export async function PUT(request: Request, { params }: Ctx) {
    return proxy(request, (await params).path);
}
export async function PATCH(request: Request, { params }: Ctx) {
    return proxy(request, (await params).path);
}
export async function DELETE(request: Request, { params }: Ctx) {
    return proxy(request, (await params).path);
}