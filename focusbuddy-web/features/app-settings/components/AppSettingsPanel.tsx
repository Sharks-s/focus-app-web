"use client";

import { useMemo, useState } from "react";
import { Save, Search, Settings2 } from "lucide-react";
import { useAppSettings, useUpdateAppSetting } from "../hooks/useAppSettings";
import type { AppSettingItem } from "../types/appSettings.types";

const IMPORTANT_KEYS = new Set([
    "dailyFreeUsage",
    "defaultCycleMinutes",
    "app.seed.defaultPetCode",
    "app.seed.defaultPersonalityCode",
]);

export function AppSettingsPanel() {
    const { data, isPending, isError, isFetching } = useAppSettings();
    const update = useUpdateAppSetting();
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("ALL");
    const [drafts, setDrafts] = useState<Record<string, string>>({});

    const categories = useMemo(() => {
        const values = new Set((data ?? []).map((item) => item.category ?? "General"));
        return ["ALL", ...Array.from(values).sort()];
    }, [data]);

    const filtered = useMemo(() => {
        const needle = keyword.trim().toLowerCase();
        return (data ?? []).filter((item) => {
            const itemCategory = item.category ?? "General";
            const matchesCategory = category === "ALL" || itemCategory === category;
            const matchesKeyword =
                !needle ||
                item.key.toLowerCase().includes(needle) ||
                item.value.toLowerCase().includes(needle) ||
                (item.description ?? "").toLowerCase().includes(needle);
            return matchesCategory && matchesKeyword;
        });
    }, [category, data, keyword]);

    function getDraft(item: AppSettingItem) {
        return drafts[item.key] ?? item.value ?? "";
    }

    function setDraft(key: string, value: string) {
        setDrafts((current) => ({ ...current, [key]: value }));
    }

    async function save(item: AppSettingItem) {
        await update.mutateAsync({ key: item.key, value: getDraft(item) });
        setDrafts((current) => {
            const next = { ...current };
            delete next[item.key];
            return next;
        });
    }

    const highlighted = filtered.filter((item) => IMPORTANT_KEYS.has(item.key));
    const regular = filtered.filter((item) => !IMPORTANT_KEYS.has(item.key));

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">App Settings</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Chỉnh các giá trị runtime như seed, dailyFreeUsage, defaultCycleMinutes qua UI.
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                    <Settings2 className="h-4 w-4" />
                    {isFetching ? "Đang đồng bộ..." : `${data?.length ?? 0} settings`}
                </div>
            </div>

            {isError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    Không thể tải App Settings. Kiểm tra backend endpoint /admin/app-settings.
                </p>
            )}

            <div className="flex flex-wrap gap-2">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Tìm theo key, value, mô tả..."
                        className="w-80 rounded-md border py-2 pl-9 pr-3 text-sm"
                    />
                </div>
                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="rounded-md border px-3 py-2 text-sm"
                >
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item === "ALL" ? "Tất cả nhóm" : item}
                        </option>
                    ))}
                </select>
            </div>

            {isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {update.isError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    Lưu setting thất bại. Kiểm tra value type hoặc quyền admin.
                </p>
            )}

            {highlighted.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase text-muted-foreground">Quan trọng</h2>
                    <div className="grid gap-3 xl:grid-cols-2">
                        {highlighted.map((item) => (
                            <SettingEditor
                                key={item.key}
                                item={item}
                                value={getDraft(item)}
                                dirty={drafts[item.key] != null && drafts[item.key] !== item.value}
                                isSaving={update.isPending}
                                onChange={(value) => setDraft(item.key, value)}
                                onSave={() => save(item)}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase text-muted-foreground">Tất cả settings</h2>
                {filtered.length === 0 && !isPending && (
                    <p className="rounded-md border px-3 py-6 text-center text-sm text-muted-foreground">
                        Không tìm thấy setting phù hợp.
                    </p>
                )}
                <div className="grid gap-3 xl:grid-cols-2">
                    {regular.map((item) => (
                        <SettingEditor
                            key={item.key}
                            item={item}
                            value={getDraft(item)}
                            dirty={drafts[item.key] != null && drafts[item.key] !== item.value}
                            isSaving={update.isPending}
                            onChange={(value) => setDraft(item.key, value)}
                            onSave={() => save(item)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function SettingEditor({
    item,
    value,
    dirty,
    isSaving,
    onChange,
    onSave,
}: {
    item: AppSettingItem;
    value: string;
    dirty: boolean;
    isSaving: boolean;
    onChange: (value: string) => void;
    onSave: () => void;
}) {
    const editable = item.editable !== false;

    return (
        <div className="rounded-md border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-all font-mono text-sm font-semibold">{item.key}</h3>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{item.valueType}</span>
                        {item.category && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{item.category}</span>
                        )}
                    </div>
                    {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                </div>
                {dirty && <span className="shrink-0 text-xs font-medium text-amber-600">Chưa lưu</span>}
            </div>

            <div className="mt-4 flex gap-2">
                {item.valueType === "BOOLEAN" ? (
                    <select
                        value={value}
                        disabled={!editable}
                        onChange={(event) => onChange(event.target.value)}
                        className="w-40 rounded-md border px-3 py-2 text-sm disabled:bg-gray-50"
                    >
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                ) : item.valueType === "JSON" ? (
                    <textarea
                        value={value}
                        disabled={!editable}
                        onChange={(event) => onChange(event.target.value)}
                        rows={4}
                        className="min-h-24 flex-1 rounded-md border px-3 py-2 font-mono text-sm disabled:bg-gray-50"
                    />
                ) : (
                    <input
                        value={value}
                        disabled={!editable}
                        type={item.valueType === "NUMBER" ? "number" : "text"}
                        onChange={(event) => onChange(event.target.value)}
                        className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm disabled:bg-gray-50"
                    />
                )}
                <button
                    type="button"
                    disabled={!editable || !dirty || isSaving}
                    onClick={onSave}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-black px-3 text-sm text-white disabled:opacity-40"
                    title="Lưu setting"
                >
                    <Save className="h-4 w-4" />
                    Lưu
                </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {item.defaultValue != null && <span>Default: {item.defaultValue}</span>}
                {item.updatedAt && <span>Cập nhật: {new Date(item.updatedAt).toLocaleString("vi-VN")}</span>}
                {!editable && <span>Readonly</span>}
            </div>
        </div>
    );
}
