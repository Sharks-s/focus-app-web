// lib/serverFetch.ts

const BE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export const ACCESS_COOKIE = "admin_access_token";
export const REFRESH_COOKIE = "refresh_token";

export const ACCESS_COOKIE_MAX_AGE = 60 * 15;

export function getBackendUrl(path: string) {
    return `${BE_URL}${path}`;
}

// Gọi thẳng Spring Boot từ server (Route Handler), không đi qua browser
export async function fetchBackend(path: string, options: RequestInit = {}) {
    return fetch(getBackendUrl(path), {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        cache: "no-store",
    });
}

// Lấy toàn bộ giá trị Set-Cookie từ response BE (có thể nhiều cookie 1 lúc)
export function getSetCookies(res: Response): string[] {
    const anyHeaders = res.headers as unknown as { getSetCookie?: () => string[] };
    if (typeof anyHeaders.getSetCookie === "function") {
        return anyHeaders.getSetCookie();
    }
    const single = res.headers.get("set-cookie");
    return single ? [single] : [];
}

export function accessCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: ACCESS_COOKIE_MAX_AGE,
    };
}