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
            // The store exposes the error message for rendering below.
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-bold text-[#1a1b25]">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="px-3 py-2.5"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-bold text-[#1a1b25]">
                    Mật khẩu
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="px-3 py-2.5"
                />
            </div>

            {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                    {error}
                </p>
            )}

            <button type="submit" disabled={isLoading} className="py-2.5 disabled:opacity-50">
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
        </form>
    );
}
