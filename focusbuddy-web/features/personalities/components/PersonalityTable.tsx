"use client";

import { useState } from "react";
import { usePersonalitiesList, useDeletePersonality } from "../hooks/usePersonalities";
import { PersonalityFormModal } from "./PersonalityFormModal";
import type { PersonalityResponse } from "../types/personalities.types";

export function PersonalityTable() {
    const { data, isPending, isError } = usePersonalitiesList();
    const deletePersonality = useDeletePersonality();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<PersonalityResponse | null>(null);

    function openCreate() {
        setEditing(null);
        setModalOpen(true);
    }

    function openEdit(p: PersonalityResponse) {
        setEditing(p);
        setModalOpen(true);
    }

    async function handleDelete(id: number) {
        if (!confirm("Xóa personality này? Hành động không thể hoàn tác.")) return;
        await deletePersonality.mutateAsync(id);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <button
                    onClick={openCreate}
                    className="rounded-md bg-black px-4 py-2 text-sm text-white"
                >
                    + Tạo mới
                </button>
            </div>

            {isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {isError && <p className="text-sm text-red-500">Có lỗi khi tải danh sách.</p>}

            {data && (
                <table className="w-full text-sm border rounded-md overflow-hidden">
                    <thead className="bg-muted text-left">
                        <tr>
                            <th className="px-3 py-2">Code</th>
                            <th className="px-3 py-2">Tên</th>
                            <th className="px-3 py-2">Mô tả</th>
                            <th className="px-3 py-2">Premium</th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="px-3 py-2 font-mono text-xs">{p.code}</td>
                                <td className="px-3 py-2">{p.name}</td>
                                <td className="px-3 py-2 text-muted-foreground">{p.description ?? "—"}</td>
                                <td className="px-3 py-2">{p.isPremium ? "Có" : "Không"}</td>
                                <td className="px-3 py-2 text-right">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="text-blue-600 hover:underline mr-3"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
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

            {modalOpen && (
                <PersonalityFormModal editing={editing} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
}