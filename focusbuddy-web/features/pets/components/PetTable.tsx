"use client";

import { useState } from "react";
import { usePetsList } from "../hooks/usePets";
import { PetEditModal } from "./PetEditModal";
import type { AdminPetResponse } from "../types/pets.types";

export function PetTable() {
    const { data, isPending, isError } = usePetsList();
    const [editing, setEditing] = useState<AdminPetResponse | null>(null);

    return (
        <div className="flex flex-col gap-4">
            {isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {isError && <p className="text-sm text-red-500">Có lỗi khi tải danh sách.</p>}

            {data && (
                <table className="w-full text-sm border rounded-md overflow-hidden">
                    <thead className="bg-muted text-left">
                        <tr>
                            <th className="px-3 py-2">Ảnh</th>
                            <th className="px-3 py-2">Code</th>
                            <th className="px-3 py-2">Tên</th>
                            <th className="px-3 py-2">Mô tả</th>
                            <th className="px-3 py-2">Premium</th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((pet) => (
                            <tr key={pet.id} className="border-t">
                                <td className="px-3 py-2">
                                    {pet.imageUrl ? (
                                        <img src={pet.imageUrl} alt={pet.name} className="h-10 w-10 rounded object-cover" />
                                    ) : (
                                        <div className="h-10 w-10 rounded bg-muted" />
                                    )}
                                </td>
                                <td className="px-3 py-2 font-mono text-xs">{pet.code}</td>
                                <td className="px-3 py-2">{pet.name}</td>
                                <td className="px-3 py-2 text-muted-foreground">{pet.description ?? "—"}</td>
                                <td className="px-3 py-2">{pet.premium ? "Có" : "Không"}</td>
                                <td className="px-3 py-2 text-right">
                                    <button
                                        onClick={() => setEditing(pet)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Sửa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {editing && <PetEditModal pet={editing} onClose={() => setEditing(null)} />}
        </div>
    );
}