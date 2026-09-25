"use client";

import { useMemo, useState } from "react";
import {
    CheckCircle2,
    Clock3,
    Inbox,
    MessageSquareReply,
    Search,
    Star,
} from "lucide-react";
import {
    feedbackStatusLabel,
    feedbackTypeLabel,
    type UserFeedback,
    type UserFeedbackStatus,
    type UserFeedbackType,
} from "../types/userFeedbacks.types";
import {
    useUpdateFeedbackReply,
    useUpdateFeedbackStatus,
    useUserFeedbacks,
} from "../hooks/useUserFeedbacks";
import type { UseMutationResult } from "@tanstack/react-query";

const STATUS_OPTIONS: Array<UserFeedbackStatus | "ALL"> = [
    "ALL",
    "NEW",
    "REVIEWING",
    "RESOLVED",
    "REJECTED",
];

const TYPE_OPTIONS: Array<UserFeedbackType | "ALL"> = [
    "ALL",
    "BUG",
    "FEATURE_REQUEST",
    "GENERAL",
    "UI_UX",
    "PAYMENT",
];

const STATUS_BADGE_STYLE: Record<UserFeedbackStatus, string> = {
    NEW: "bg-blue-100 text-blue-700",
    REVIEWING: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: UserFeedbackStatus }) {
    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_BADGE_STYLE[status]}`}>
            {feedbackStatusLabel[status]}
        </span>
    );
}

function formatDate(value: string) {
    return new Date(value).toLocaleString("vi-VN");
}

function formatRating(rating?: number | null) {
    return typeof rating === "number" ? `${rating.toFixed(1).replace(".0", "")}/5` : "Không có";
}

function matchesSearch(item: UserFeedback, search: string) {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;

    return [item.title, item.content, String(item.userId)].some((value) =>
        value.toLowerCase().includes(keyword),
    );
}

function StatTile({
    label,
    value,
    icon: Icon,
    tone,
}: {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    tone: string;
}) {
    return (
        <div className="rounded-2xl border border-[#e9e6f5] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-bold text-muted-foreground">{label}</p>
                    <p className="mt-1 text-2xl font-extrabold">{value.toLocaleString("vi-VN")}</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function FeedbackDetailPanel({
    feedback,
    updateStatus,
    updateReply,
}: {
    feedback: UserFeedback | null;
    updateStatus: UseMutationResult<UserFeedback, Error, { id: number; status: UserFeedbackStatus }>;
    updateReply: UseMutationResult<UserFeedback, Error, { id: number; adminReply?: string | null }>;
}) {
    const [replyDraft, setReplyDraft] = useState(feedback?.adminReply ?? "");

    function handleSaveReply() {
        if (!feedback) return;
        const normalizedReply = replyDraft.trim();
        updateReply.mutate({
            id: feedback.id,
            adminReply: normalizedReply ? normalizedReply : null,
        });
    }

    function handleStatusChange(status: UserFeedbackStatus) {
        if (!feedback || status === feedback.status) return;
        updateStatus.mutate({ id: feedback.id, status });
    }

    if (!feedback) {
        return (
            <aside className="rounded-2xl border border-[#e9e6f5] bg-white p-5">
                <p className="text-sm font-semibold text-muted-foreground">
                    Chọn một feedback để xem chi tiết.
                </p>
            </aside>
        );
    }

    return (
        <aside className="rounded-2xl border border-[#e9e6f5] bg-white p-5">
            <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#483bfc]">
                            Feedback #{feedback.id}
                        </p>
                        <h2 className="mt-1 text-lg font-extrabold">{feedback.title}</h2>
                        <p className="mt-1 text-sm font-semibold text-muted-foreground">
                            User {feedback.userId} · {feedbackTypeLabel[feedback.type]}
                        </p>
                    </div>
                    <StatusBadge status={feedback.status} />
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-700">
                        <Star className="h-4 w-4 fill-current" />
                        {formatRating(feedback.rating)}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 font-bold text-muted-foreground">
                        Tạo: {formatDate(feedback.createdAt)}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 font-bold text-muted-foreground">
                        Sửa: {formatDate(feedback.updatedAt)}
                    </span>
                </div>

                <div className="border-t border-[#e9e6f5] pt-4">
                    <p className="mb-2 text-sm font-extrabold">Nội dung</p>
                    <p className="whitespace-pre-wrap text-sm font-semibold leading-6 text-muted-foreground">
                        {feedback.content}
                    </p>
                </div>

                <div className="border-t border-[#e9e6f5] pt-4">
                    <label className="mb-2 block text-sm font-extrabold">Đổi trạng thái</label>
                    <select
                        value={feedback.status}
                        disabled={updateStatus.isPending}
                        onChange={(event) =>
                            handleStatusChange(event.target.value as UserFeedbackStatus)
                        }
                        className="h-11 w-full px-3 text-sm"
                    >
                        {STATUS_OPTIONS.filter((status) => status !== "ALL").map((status) => (
                            <option key={status} value={status}>
                                {feedbackStatusLabel[status]}
                            </option>
                        ))}
                    </select>
                    {updateStatus.isError && (
                        <p className="mt-2 text-sm font-semibold text-red-500">
                            Cập nhật trạng thái thất bại.
                        </p>
                    )}
                </div>

                <div className="border-t border-[#e9e6f5] pt-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <label className="text-sm font-extrabold">Admin reply</label>
                        {!feedback.adminReply && (
                            <span className="text-xs font-bold text-muted-foreground">
                                Chưa phản hồi
                            </span>
                        )}
                    </div>
                    <textarea
                        value={replyDraft}
                        onChange={(event) => setReplyDraft(event.target.value)}
                        rows={6}
                        placeholder="Nhập phản hồi cho user"
                        className="w-full resize-y p-3 text-sm"
                    />
                    <button
                        onClick={handleSaveReply}
                        disabled={updateReply.isPending}
                        className="mt-3 inline-flex min-h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-extrabold text-white disabled:opacity-60"
                    >
                        {updateReply.isPending ? "Đang lưu..." : "Lưu reply"}
                    </button>
                    {updateReply.isError && (
                        <p className="mt-2 text-sm font-semibold text-red-500">
                            Lưu phản hồi thất bại.
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
}

export function UserFeedbacksPanel() {
    const { data, isPending, isError, isFetching, dataUpdatedAt } = useUserFeedbacks();
    const updateStatus = useUpdateFeedbackStatus();
    const updateReply = useUpdateFeedbackReply();

    const [statusFilter, setStatusFilter] = useState<UserFeedbackStatus | "ALL">("ALL");
    const [typeFilter, setTypeFilter] = useState<UserFeedbackType | "ALL">("ALL");
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const sortedFeedbacks = useMemo(
        () =>
            [...(data ?? [])].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            ),
        [data],
    );

    const filteredFeedbacks = useMemo(
        () =>
            sortedFeedbacks.filter((item) => {
                const statusMatched = statusFilter === "ALL" || item.status === statusFilter;
                const typeMatched = typeFilter === "ALL" || item.type === typeFilter;
                return statusMatched && typeMatched && matchesSearch(item, search);
            }),
        [search, sortedFeedbacks, statusFilter, typeFilter],
    );

    const selectedFeedback =
        sortedFeedbacks.find((item) => item.id === selectedId) ?? filteredFeedbacks[0] ?? null;

    const stats = useMemo(
        () => ({
            total: sortedFeedbacks.length,
            newCount: sortedFeedbacks.filter((item) => item.status === "NEW").length,
            reviewing: sortedFeedbacks.filter((item) => item.status === "REVIEWING").length,
            resolved: sortedFeedbacks.filter((item) => item.status === "RESOLVED").length,
        }),
        [sortedFeedbacks],
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="grid gap-4 md:grid-cols-4">
                <StatTile label="Tổng feedback" value={stats.total} icon={Inbox} tone="bg-violet-50 text-violet-600" />
                <StatTile label="Mới" value={stats.newCount} icon={MessageSquareReply} tone="bg-blue-50 text-blue-600" />
                <StatTile label="Đang xem xét" value={stats.reviewing} icon={Clock3} tone="bg-yellow-50 text-yellow-700" />
                <StatTile label="Đã xử lý" value={stats.resolved} icon={CheckCircle2} tone="bg-green-50 text-green-700" />
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <section className="rounded-2xl border border-[#e9e6f5] bg-white p-4">
                    <div className="flex flex-col gap-3">
                        <div>
                            <h2 className="text-base font-extrabold">Danh sách feedback</h2>
                            <p className="text-sm font-semibold text-muted-foreground">
                                {isFetching
                                    ? "Đang cập nhật..."
                                    : dataUpdatedAt
                                      ? `Cập nhật lúc ${new Date(dataUpdatedAt).toLocaleTimeString("vi-VN")}`
                                      : ""}
                            </p>
                        </div>

                        <div className="grid max-w-full grid-cols-1 gap-2 lg:grid-cols-[minmax(220px,1fr)_190px_170px]">
                            <label className="relative min-w-0">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Tìm title, content, userId"
                                    className="h-10 w-full pl-9 pr-3 text-sm"
                                />
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value as UserFeedbackStatus | "ALL")
                                }
                                className="h-10 min-w-0 px-3 text-sm"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status === "ALL" ? "Tất cả trạng thái" : feedbackStatusLabel[status]}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={typeFilter}
                                onChange={(event) =>
                                    setTypeFilter(event.target.value as UserFeedbackType | "ALL")
                                }
                                className="h-10 min-w-0 px-3 text-sm"
                            >
                                {TYPE_OPTIONS.map((type) => (
                                    <option key={type} value={type}>
                                        {type === "ALL" ? "Tất cả loại" : feedbackTypeLabel[type]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isPending && <p className="mt-5 text-sm text-muted-foreground">Đang tải feedback...</p>}
                    {isError && <p className="mt-5 text-sm text-red-500">Có lỗi khi tải feedback.</p>}

                    {!isPending && !isError && (
                        <div className="mt-4 overflow-hidden rounded-md border border-[#e9e6f5]">
                            <div className="overflow-x-auto">
                                <table className="min-w-[780px] table-fixed">
                                    <colgroup>
                                        <col className="w-[52px]" />
                                        <col className="w-[68px]" />
                                        <col className="w-[150px]" />
                                        <col />
                                        <col className="w-[84px]" />
                                        <col className="w-[116px]" />
                                        <col className="w-[150px]" />
                                    </colgroup>
                                    <thead>
                                        <tr className="text-left">
                                            <th>ID</th>
                                            <th>User</th>
                                            <th>Loại</th>
                                            <th>Tiêu đề</th>
                                            <th>Rating</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày tạo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFeedbacks.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                                    Không có feedback phù hợp.
                                                </td>
                                            </tr>
                                        )}
                                        {filteredFeedbacks.map((item) => {
                                            const active = item.id === selectedFeedback?.id;
                                            return (
                                                <tr
                                                    key={item.id}
                                                    onClick={() => setSelectedId(item.id)}
                                                    className={active ? "bg-[#f5f2ff]" : ""}
                                                >
                                                    <td>#{item.id}</td>
                                                    <td>{item.userId}</td>
                                                    <td className="break-words">{feedbackTypeLabel[item.type]}</td>
                                                    <td className="min-w-56 max-w-80">
                                                        <p className="truncate font-extrabold">{item.title}</p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {item.content}
                                                        </p>
                                                    </td>
                                                    <td>{formatRating(item.rating)}</td>
                                                    <td>
                                                        <StatusBadge status={item.status} />
                                                    </td>
                                                    <td>{formatDate(item.createdAt)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>

                <FeedbackDetailPanel
                    key={`${selectedFeedback?.id ?? "empty"}-${selectedFeedback?.adminReply ?? ""}`}
                    feedback={selectedFeedback}
                    updateStatus={updateStatus}
                    updateReply={updateReply}
                />
            </div>
        </div>
    );
}
