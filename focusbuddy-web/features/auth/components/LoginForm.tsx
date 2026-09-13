"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export function LoginForm() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        clearError();
        try {
            await login({ email, password });
            router.push("/admin/dashboard");
        } catch {
            // error đã có trong store
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border rounded-md px-3 py-2"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium">Mật khẩu</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border rounded-md px-3 py-2"
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white rounded-md py-2 disabled:opacity-50"
            >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
        </form>
    );
}