"use client";

import { useState } from "react";
import { useAppRulesList, useCreateAppRule, useDeleteAppRule } from "../hooks/useAppRules";
import type { RuleType } from "../types/appRules.types";

export function AppRuleTable() {
    const { data, isPending, isError } = useAppRulesList();
    const create = useCreateAppRule();
    const del = useDeleteAppRule();

    const [filter, setFilter] = useState<RuleType | "ALL">("ALL");
    const [keyword, setKeyword] = useState("");
    const [ruleType, setRuleType] = useState<RuleType>("BLACKLIST");

    const filtered = data?.filter((r) => filter === "ALL" || r.ruleType === filter);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!keyword.trim()) return;
        await create.mutateAsync({ keyword: keyword.trim(), ruleType });
        setKeyword("");
    }

    async function handleDelete(id: number) {
        if (!confirm("Xóa rule này?")) return;
        await del.mutateAsync(id);
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Form thêm rule mới */}
            <form onSubmit={handleCreate} className="flex gap-2">
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Keyword (tên app hoặc từ khóa tiêu đề cửa sổ)..."
                    maxLength={255}
                    className="border rounded-md px-3 py-2 text-sm flex-1"
                />
                <select
                    value={ruleType}
                    onChange={(e) => setRuleType(e.target.value as RuleType)}
                    className="border rounded-md px-3 py-2 text-sm"
                >
                    <option value="BLACKLIST">Blacklist</option>
                    <option value="WHITELIST">Whitelist</option>
                </select>
                <button
                    type="submit"
                    disabled={create.isPending}
                    className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                    + Thêm
                </button>
            </form>
            {create.isError && <p className="text-sm text-red-500">Thêm thất bại (có thể trùng keyword).</p>}

            {/* Filter */}
            <div className="flex gap-2">
                {(["ALL", "BLACKLIST", "WHITELIST"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`rounded-md px-3 py-1.5 text-sm border ${filter === f ? "bg-black text-white" : "hover:bg-muted"
                            }`}
                    >
                        {f === "ALL" ? "Tất cả" : f}
                    </button>
                ))}
            </div>

            {isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {isError && <p className="text-sm text-red-500">Có lỗi khi tải danh sách.</p>}

            {filtered && (
                <table className="w-full text-sm border rounded-md overflow-hidden">
                    <thead className="bg-muted text-left">
                        <tr>
                            <th className="px-3 py-2">Keyword</th>
                            <th className="px-3 py-2">Loại</th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">
                                    Chưa có rule nào.
                                </td>
                            </tr>
                        )}
                        {filtered.map((rule) => (
                            <tr key={rule.id} className="border-t">
                                <td className="px-3 py-2">{rule.keyword}</td>
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
                                        onClick={() => handleDelete(rule.id)}
                                        className="text-red-500 hover:underline"
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