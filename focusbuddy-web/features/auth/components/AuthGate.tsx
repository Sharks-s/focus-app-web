"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export function AuthGate({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isInitializing, bootstrap } = useAuthStore();

    useEffect(() => {
        bootstrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isInitializing && !user) {
            router.replace("/admin/login");
        }
    }, [isInitializing, user, router]);

    if (isInitializing) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p className="text-sm text-muted-foreground">Đang tải...</p>
            </div>
        );
    }

    if (!user) {
        return null; // đang trong lúc redirect
    }

    return <>{children}</>;
}