const STALE_THRESHOLD_MINUTES = 5;

export function HeartbeatStatus({ lastHeartbeatAt }: { lastHeartbeatAt: string | null }) {
    if (!lastHeartbeatAt) {
        return <span className="text-xs text-muted-foreground">Chưa có heartbeat</span>;
    }

    const minutesAgo = (Date.now() - new Date(lastHeartbeatAt).getTime()) / 60000;
    const isStale = minutesAgo > STALE_THRESHOLD_MINUTES;

    return (
        <span
            className={`text-xs ${isStale ? "text-red-600 font-medium" : "text-green-600"}`}
            title={new Date(lastHeartbeatAt).toLocaleString("vi-VN")}
        >
            {isStale ? `⚠ Không phản hồi ${Math.floor(minutesAgo)}p` : "● Đang hoạt động"}
        </span>
    );
}