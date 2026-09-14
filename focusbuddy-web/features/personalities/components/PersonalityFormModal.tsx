"use client";

import { useState, useEffect } from "react";
import { useCreatePersonality, useUpdatePersonality } from "../hooks/usePersonalities";
import type { PersonalityResponse } from "../types/personalities.types";

export function PersonalityFormModal({
    editing,
    onClose,
}: {
    editing: PersonalityResponse | null; // null = tạo mới, có giá trị = đang sửa
    onClose: () => void;
}) {
    const create = useCreatePersonality();
    const update = useUpdatePersonality();

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        if (editing) {
            setCode(editing.code);
            setName(editing.name);
            setDescription(editing.description ?? "");
            setIsPremium(editing.isPremium);
        }
    }, [editing]);

    const isPending = create.isPending || update.isPending;
    const error = create.error || update.error;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = { code, name, description, isPremium };

        try {
            if (editing) {
                await update.mutateAsync({ id: editing.id, data: payload });
            } else {
                await create.mutateAsync(payload);
            }
            onClose();
        } catch {
            // lỗi hiển thị bên dưới qua `error`
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-background p-6 shadow-xl"
            >
                <h2 className="text-lg font-semibold">
                    {editing ? "Sửa Personality" : "Tạo Personality mới"}
                </h2>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Code</label>
                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        maxLength={50}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Tên</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={100}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Mô tả</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={255}
                        rows={3}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.target.checked)}
                    />
                    Premium
                </label>

                {error && <p className="text-sm text-red-500">Có lỗi xảy ra, thử lại.</p>}

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                        {isPending ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </form>
        </div>
    );
}