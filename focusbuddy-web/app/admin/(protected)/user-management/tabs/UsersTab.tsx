"use client";

import { useState } from "react";
import { UserTable, UserDetailDrawer } from "@/features/users";

export function UsersTab() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-4 pt-4">
            <UserTable onSelectUser={setSelectedId} />
            {selectedId !== null && (
                <UserDetailDrawer userId={selectedId} onClose={() => setSelectedId(null)} />
            )}
        </div>
    );
}