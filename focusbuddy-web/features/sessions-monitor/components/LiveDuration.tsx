"use client";

import { useEffect, useState } from "react";

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
}

export function LiveDuration({ startedAt }: { startedAt: string }) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const elapsedSeconds = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));

    return <span className="font-mono">{formatDuration(elapsedSeconds)}</span>;
}