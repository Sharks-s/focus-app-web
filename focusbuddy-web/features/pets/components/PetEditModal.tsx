"use client";

import { useState, useEffect } from "react";
import { useUpdatePet } from "../hooks/usePets";
import type { AdminPetResponse } from "../types/pets.types";

export function PetEditModal({
    pet,
    onClose,
}: {
    pet: AdminPetResponse;
    onClose: () => void;
}) {
    const update = useUpdatePet();

    const [name, setName] = useState(pet.name);
    const [description, setDescription] = useState(pet.description ?? "");
    const [imageUrl, setImageUrl] = useState(pet.imageUrl ?? "");
    const [premium, setPremium] = useState(pet.premium);

    useEffect(() => {
        setName(pet.name);
        setDescription(pet.description ?? "");
        setImageUrl(pet.imageUrl ?? "");
        setPremium(pet.premium);
    }, [pet]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await update.mutateAsync({
                id: pet.id,
                data: { name, description, imageUrl, premium },
            });
            onClose();
        } catch {
            // lỗi hiển thị bên dưới
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-background p-6 shadow-xl"
            >
                <h2 className="text-lg font-semibold">Sửa Pet — {pet.code}</h2>
                <p className="text-xs text-muted-foreground">
                    Code không thể đổi (animation gắn sẵn trong app, thay đổi code sẽ làm sai lệch client).
                </p>

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
                        maxLength={512}
                        rows={3}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Image URL</label>
                    <input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        maxLength={512}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={premium}
                        onChange={(e) => setPremium(e.target.checked)}
                    />
                    Premium
                </label>

                {update.isError && <p className="text-sm text-red-500">Có lỗi xảy ra, thử lại.</p>}

                <div className="flex justify-end gap-2 pt-2">
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