"use client";

import { useState, useEffect, useMemo } from "react";
import { useUpdatePromptTemplate } from "../hooks/usePromptTemplates";
import type { PromptTemplateResponse } from "../types/promptTemplates.types";

// Tìm mọi placeholder dạng {xxx} trong template để cảnh báo admin trước khi lưu
function extractPlaceholders(text: string): string[] {
    const matches = text.match(/\{[a-zA-Z0-9_]+\}/g);
    return matches ? Array.from(new Set(matches)) : [];
}

export function PromptTemplateEditModal({
    item,
    onClose,
}: {
    item: PromptTemplateResponse;
    onClose: () => void;
}) {
    const update = useUpdatePromptTemplate();
    const [template, setTemplate] = useState(item.template);

    useEffect(() => {
        setTemplate(item.template);
    }, [item]);

    const originalPlaceholders = useMemo(() => extractPlaceholders(item.template), [item.template]);
    const currentPlaceholders = useMemo(() => extractPlaceholders(template), [template]);
    const missingPlaceholders = originalPlaceholders.filter((p) => !currentPlaceholders.includes(p));

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await update.mutateAsync({ id: item.id, data: { template } });
            onClose();
        } catch {
            // lỗi hiển thị bên dưới
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={onClose}>
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-2xl flex-col gap-4 rounded-lg bg-background p-6 shadow-xl"
            >
                <h2 className="text-lg font-semibold">Sửa template — {item.promptKey}</h2>

                <div className="flex flex-wrap gap-1.5">
                    {originalPlaceholders.map((p) => (
                        <span
                            key={p}
                            className={`rounded-full px-2 py-0.5 text-xs font-mono ${currentPlaceholders.includes(p)
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {p}
                        </span>
                    ))}
                </div>

                {missingPlaceholders.length > 0 && (
                    <p className="text-xs text-red-600">
                        ⚠ Đang thiếu {missingPlaceholders.length} placeholder so với bản gốc
                        ({missingPlaceholders.join(", ")}) — hệ thống sẽ lỗi khi build prompt nếu code vẫn cần các biến này.
                    </p>
                )}

                <textarea
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    rows={18}
                    className="border rounded-md px-3 py-2 text-sm font-mono"
                />

                {update.isError && <p className="text-sm text-red-500">Lưu thất bại, thử lại.</p>}

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={update.isPending}
                        className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                        {update.isPending ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </form>
        </div>
    );
}