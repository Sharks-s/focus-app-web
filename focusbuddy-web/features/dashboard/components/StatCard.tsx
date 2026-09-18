"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: number | string;
    subLabel?: string;
    icon: LucideIcon;
    color: "violet" | "emerald" | "sky" | "amber";
    isLoading?: boolean;
}

const colorMap = {
    violet: {
        bg: "bg-violet-50",
        icon: "bg-violet-500",
        text: "text-violet-600",
        badge: "bg-violet-100 text-violet-700",
    },
    emerald: {
        bg: "bg-emerald-50",
        icon: "bg-emerald-500",
        text: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
    },
    sky: {
        bg: "bg-sky-50",
        icon: "bg-sky-500",
        text: "text-sky-600",
        badge: "bg-sky-100 text-sky-700",
    },
    amber: {
        bg: "bg-amber-50",
        icon: "bg-amber-500",
        text: "text-amber-600",
        badge: "bg-amber-100 text-amber-700",
    },
};

export function StatCard({ label, value, subLabel, icon: Icon, color, isLoading }: StatCardProps) {
    const c = colorMap[color];

    if (isLoading) {
        return (
            <div className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse">
                <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-gray-100" />
                    <div className="h-5 w-16 rounded-full bg-gray-100" />
                </div>
                <div className="mt-4 h-8 w-24 rounded bg-gray-100" />
                <div className="mt-2 h-4 w-32 rounded bg-gray-100" />
            </div>
        );
    }

    return (
        <div
            className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
        >
            <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.icon}`}>
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                {subLabel && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.badge}`}>
                        {subLabel}
                    </span>
                )}
            </div>

            <p className={`mt-4 text-3xl font-bold tracking-tight text-gray-900`}>
                {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
            </p>
            <p className="mt-1 text-sm text-gray-500">{label}</p>
        </div>
    );
}
