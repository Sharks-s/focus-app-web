import type { ViolationType } from "../types/violations.types";

const LABELS: Record<ViolationType, string> = {
    AWAY: "Rời khỏi ghế",
    LOOK_AWAY: "Nhìn đi chỗ khác",
    BAD_POSTURE: "Sai tư thế",
    POOR_LIGHTING: "Thiếu sáng",
    TOO_CLOSE: "Ngồi quá gần",
    ENTERTAINMENT: "Mở app giải trí",
};

export function ViolationTypeLabel({ type }: { type: ViolationType }) {
    return <span>{LABELS[type] ?? type}</span>;
}