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
        bg: "from-blue-50 to-white",
        icon: "bg-blue-600",
        text: "text-violet-600",
        badge: "bg-blue-100 text-blue-700",
        border: "border-blue-100",
    },
    emerald: {
        bg: "from-emerald-50 to-white",
        icon: "bg-emerald-500",
        text: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
        border: "border-emerald-100",
    },
    sky: {
        bg: "from-cyan-50 to-white",
        icon: "bg-cyan-500",
        text: "text-sky-600",
        badge: "bg-cyan-100 text-cyan-700",
        border: "border-cyan-100",
    },
    amber: {
        bg: "from-amber-50 to-white",
        icon: "bg-amber-500",
        text: "text-amber-600",
        badge: "bg-amber-100 text-amber-700",
        border: "border-amber-100",
    },
};

export function StatCard({ label, value, subLabel, icon: Icon, color, isLoading }: StatCardProps) {
    const c = colorMap[color];

    if (isLoading) {
        return (
            <div className="animate-pulse rounded-2xl border bg-white p-5 shadow-sm">
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
            className={`rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
        >
            <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${c.icon} shadow-lg shadow-slate-200`}>
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                {subLabel && (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${c.badge}`}>
                        {subLabel}
                    </span>
                )}
            </div>

            <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
                {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
        </div>
    );
}
