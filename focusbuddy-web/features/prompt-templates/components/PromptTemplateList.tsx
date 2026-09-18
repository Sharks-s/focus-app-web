"use client";

import { useState } from "react";
import { usePromptTemplatesList } from "../hooks/usePromptTemplates";
import { PromptTemplateEditModal } from "./PromptTemplateEditModal";
import type { PromptTemplateResponse } from "../types/promptTemplates.types";

export function PromptTemplateList() {
    const { data, isPending, isError } = usePromptTemplatesList();
    const [editing, setEditing] = useState<PromptTemplateResponse | null>(null);

    if (isPending) {
        return (
            <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/60" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                Có lỗi khi tải danh sách. Vui lòng thử lại.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {data?.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setEditing(item)}
                    className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-white px-5 py-4 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
                >
                    <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-xs font-semibold text-indigo-700">
                                {item.promptKey}
                            </span>
                        </div>
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {item.template.replace(/\s+/g, " ").trim()}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground/70">
                            Cập nhật: {new Date(item.updatedAt).toLocaleString("vi-VN")}
                        </p>
                    </div>

                    <span className="mt-1 shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors group-hover:bg-indigo-50">
                        Sửa
                    </span>
                </button>
            ))}

            {editing && (
                <PromptTemplateEditModal item={editing} onClose={() => setEditing(null)} />
            )}
        </div>
    );
}