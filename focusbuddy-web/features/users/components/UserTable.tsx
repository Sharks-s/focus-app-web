"use client";

import { useState, useEffect } from "react";
import { useUsersList } from "../hooks/useUsers";
import { UserStatusBadge } from "./UserStatusBadge";
import type { UserStatus } from "../types/users.types";

const STATUS_OPTIONS: { label: string; value: UserStatus | "" }[] = [
    { label: "Tất cả trạng thái", value: "" },
    { label: "Chờ xác thực", value: "PENDING" },
    { label: "Hoạt động", value: "ACTIVE" },
    { label: "Tự khóa", value: "DEACTIVATED" },
    { label: "Tạm khóa", value: "SUSPENDED" },
    { label: "Bị cấm", value: "BLOCKED" },
];

export function UserTable({ onSelectUser }: { onSelectUser: (id: number) => void }) {
    const [keywordInput, setKeywordInput] = useState(""); // giá trị gõ trực tiếp trong ô input
    const [keyword, setKeyword] = useState("");            // giá trị thực sự dùng để gọi API, sau debounce
    const [status, setStatus] = useState<UserStatus | "">("");
    const [page, setPage] = useState(0);

    // Chỉ gọi API 400ms sau khi người dùng ngừng gõ, tránh bắn request mỗi ký tự
    useEffect(() => {
        const timer = setTimeout(() => {
            setKeyword(keywordInput);
            setPage(0);
        }, 400);
        return () => clearTimeout(timer);
    }, [keywordInput]);

    const { data, isPending, isFetching, isError } = useUsersList({
        keyword: keyword || undefined,
        status: status || undefined,
        page,
        size: 20,
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Tìm theo email, tên..."
                    className="border rounded-md px-3 py-2 text-sm w-64"
                />
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value as UserStatus | "");
                        setPage(0);
                    }}
                    className="border rounded-md px-3 py-2 text-sm"
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {isError && <p className="text-sm text-red-500">Có lỗi khi tải danh sách.</p>}

            {data && (
                <>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-medium">Danh sách</h2>
                        {isFetching && (
                            <span className="text-xs text-muted-foreground animate-pulse">⟳ đang cập nhật...</span>
                        )}
                    </div>

                    <table className="w-full text-sm border rounded-md overflow-hidden">
                        <thead className="bg-muted text-left">
                            <tr>
                                <th className="px-3 py-2">Email</th>
                                <th className="px-3 py-2">Họ tên</th>
                                <th className="px-3 py-2">Trạng thái</th>
                                <th className="px-3 py-2">Premium</th>
                                <th className="px-3 py-2">Đăng nhập gần nhất</th>
                                <th className="px-3 py-2">Vai trò</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((u) => (
                                <tr
                                    key={u.id}
                                    onClick={() => onSelectUser(u.id)}
                                    className="border-t cursor-pointer hover:bg-muted/50"
                                >
                                    <td className="px-3 py-2">{u.email}</td>
                                    <td className="px-3 py-2">{u.fullName ?? "—"}</td>
                                    <td className="px-3 py-2">
                                        <UserStatusBadge status={u.status} />
                                    </td>
                                    <td className="px-3 py-2">{u.premium ? "Có" : "Không"}</td>
                                    <td className="px-3 py-2">
                                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("vi-VN") : "—"}
                                    </td>
                                    <td className="px-3 py-2">{u.role ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between text-sm">
                        <span>
                            Trang {data.currentPage + 1} / {data.totalPages} — {data.totalItems} user
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={data.currentPage === 0}
                                onClick={() => setPage((p) => p - 1)}
                                className="border rounded-md px-3 py-1 disabled:opacity-40"
                            >
                                Trước
                            </button>
                            <button
                                disabled={!data.hasNext}
                                onClick={() => setPage((p) => p + 1)}
                                className="border rounded-md px-3 py-1 disabled:opacity-40"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
