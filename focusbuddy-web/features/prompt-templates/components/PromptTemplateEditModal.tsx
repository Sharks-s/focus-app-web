"use client";

import { useState, useEffect, useMemo } from "react";
import { useUpdatePromptTemplate } from "../hooks/usePromptTemplates";
import type { PromptTemplateResponse } from "../types/promptTemplates.types";

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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-5 overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Chỉnh sửa template
                        </p>
                        <h2 className="mt-0.5 font-mono text-base font-semibold text-indigo-700">
                            {item.promptKey}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Đóng"
                    >
                        ✕
                    </button>
                </div>

                {/* Body (scrollable) */}
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6">
                    {/* Placeholders */}
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Placeholders</p>
                        <div className="flex flex-wrap gap-1.5">
                            {originalPlaceholders.length === 0 && (
                                <span className="text-xs text-muted-foreground">Không có placeholder</span>
                            )}
                            {originalPlaceholders.map((p) => (
                                <span
                                    key={p}
                                    className={`rounded-full border px-2.5 py-1 text-xs font-mono font-medium ${currentPlaceholders.includes(p)
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-red-200 bg-red-50 text-red-700"
                                        }`}
                                >
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    {missingPlaceholders.length > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700">
                            <span className="font-semibold">⚠ Thiếu {missingPlaceholders.length} placeholder</span>{" "}
                            so với bản gốc ({missingPlaceholders.join(", ")}) — hệ thống sẽ lỗi khi build
                            prompt nếu code vẫn cần các biến này.
                        </div>
                    )}

                    {/* Textarea */}
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Nội dung template</p>
                        <textarea
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            rows={16}
                            spellCheck={false}
                            className="w-full resize-y rounded-xl border border-border bg-muted/30 px-4 py-3 font-mono text-sm leading-relaxed text-foreground shadow-inner outline-none transition-colors focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {update.isError && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                            Lưu thất bại, thử lại.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t bg-muted/20 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={update.isPending}
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {update.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}