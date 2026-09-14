"use client";

import { useState } from "react";
import { usePromptTemplatesList } from "../hooks/usePromptTemplates";
import { PromptTemplateEditModal } from "./PromptTemplateEditModal";
import type { PromptTemplateResponse } from "../types/promptTemplates.types";

export function PromptTemplateList() {
    const { data, isPending, isError } = usePromptTemplatesList();
    const [editing, setEditing] = useState<PromptTemplateResponse | null>(null);

    return (
        <div className="flex flex-col gap-3">
            {isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {isError && <p className="text-sm text-red-500">Có lỗi khi tải danh sách.</p>}

            {data?.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md border px-4 py-3"
                >
                    <div className="min-w-0">
                        <p className="font-mono text-sm font-medium">{item.promptKey}</p>
                        <p className="truncate text-xs text-muted-foreground max-w-lg">
                            {item.template.replace(/\s+/g, " ").trim()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Cập nhật: {new Date(item.updatedAt).toLocaleString("vi-VN")}
                        </p>
                    </div>
                    <button
                        onClick={() => setEditing(item)}
                        className="shrink-0 text-blue-600 hover:underline text-sm"
                    >
                        Sửa
                    </button>
                </div>
            ))}

            {editing && (
                <PromptTemplateEditModal item={editing} onClose={() => setEditing(null)} />
            )}
        </div>
    );
}