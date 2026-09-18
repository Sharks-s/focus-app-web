"use client";

import { useState } from "react";
import {
    useAppRulesList,
    useCreateAppRule,
    useDeleteAppRule,
} from "../hooks/useAppRules";
import type { RuleType } from "../types/appRules.types";

export function AppRuleTable() {
    const { data, isPending, isError } = useAppRulesList();
    const create = useCreateAppRule();
    const del = useDeleteAppRule();

    const [keyword, setKeyword] = useState("");
    const [ruleType, setRuleType] = useState<RuleType>("BLACKLIST");

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        const trimmedKeyword = keyword.trim();

        if (!trimmedKeyword) return;

        try {
            await create.mutateAsync({
                keyword: trimmedKeyword,
                ruleType,
            });

            setKeyword("");
        } catch {
            // Error đã được xử lý bởi create.isError
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Xóa rule này?")) return;

        try {
            await del.mutateAsync(id);
        } catch {
            // Có thể thêm toast sau
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Form thêm rule */}
            <form onSubmit={handleCreate} className="flex gap-2">
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Keyword (tên app hoặc từ khóa tiêu đề cửa sổ)..."
                    maxLength={255}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                />

                <select
                    value={ruleType}
                    onChange={(e) =>
                        setRuleType(e.target.value as RuleType)
                    }
                    className="rounded-md border px-3 py-2 text-sm"
                >
                    <option value="BLACKLIST">Blacklist</option>
                    <option value="WHITELIST">Whitelist</option>
                </select>

                <button
                    type="submit"
                    disabled={create.isPending || !keyword.trim()}
                    className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                    {create.isPending ? "Đang thêm..." : "+ Thêm"}
                </button>
            </form>

            {create.isError && (
                <p className="text-sm text-red-500">
                    Thêm rule thất bại. Có thể keyword đã tồn tại.
                </p>
            )}

            {del.isError && (
                <p className="text-sm text-red-500">
                    Xóa rule thất bại. Vui lòng thử lại.
                </p>
            )}

            {isPending && (
                <p className="text-sm text-muted-foreground">
                    Đang tải...
                </p>
            )}

            {isError && (
                <p className="text-sm text-red-500">
                    Có lỗi khi tải danh sách.
                </p>
            )}

            {data && (
                <table className="w-full overflow-hidden rounded-md border text-sm">
                    <thead className="bg-muted text-left">
                        <tr>
                            <th className="px-3 py-2">Keyword</th>
                            <th className="px-3 py-2">Loại</th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-3 py-4 text-center text-muted-foreground"
                                >
                                    Chưa có rule nào.
                                </td>
                            </tr>
                        )}

                        {data.map((rule) => (
                            <tr key={rule.id} className="border-t">
                                <td className="px-3 py-2">
                                    {rule.keyword}
                                </td>

                                <td className="px-3 py-2">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${rule.ruleType === "BLACKLIST"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {rule.ruleType}
                                    </span>
                                </td>

                                <td className="px-3 py-2 text-right">
                                    <button
                                        onClick={() =>
                                            handleDelete(rule.id)
                                        }
                                        disabled={del.isPending}
                                        className="text-red-500 hover:underline disabled:opacity-50"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}