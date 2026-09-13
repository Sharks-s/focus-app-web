export const SESSION_EXPIRED_EVENT = "auth:session-expired";

interface ApiEnvelope<T> {
    success: boolean;
    code?: string;
    message?: string;
    data?: T;
}

export class ApiError extends Error {
    status: number;
    code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(path, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
        throw new ApiError("SESSION_EXPIRED", 401);
    }

    const json: ApiEnvelope<T> = await res.json().catch(() => ({ success: false }));

    if (!res.ok || !json.success) {
        throw new ApiError(json.message ?? "Có lỗi xảy ra", res.status, json.code);
    }

    return json.data as T;
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path, { method: "GET" }),

    post: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),

    put: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),

    patch: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),

    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};