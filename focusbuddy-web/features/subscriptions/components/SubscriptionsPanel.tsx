"use client";

import { useMemo, useState } from "react";
import { CreditCard, Crown, ReceiptText, Search, WalletCards } from "lucide-react";
import { ApiError } from "@/lib/apiClient";
import {
    useActiveSubscriptions,
    useSubscriptionStats,
    useSubscriptionTransactions,
} from "../hooks/useSubscriptions";
import type { PaymentProvider, TransactionStatus } from "../types/subscriptions.types";

const DAY_OPTIONS = [7, 30, 90];

function formatNumber(value?: number | null) {
    return new Intl.NumberFormat("vi-VN").format(value ?? 0);
}

function formatMoney(value?: number | null) {
    return `${formatNumber(value)} đ`;
}

function formatDate(value?: string | null) {
    return value ? new Date(value).toLocaleString("vi-VN") : "-";
}

function formatError(label: string, error: unknown) {
    if (!error) return null;
    if (error instanceof ApiError) {
        return `${label}: ${error.status}${error.code ? ` ${error.code}` : ""} - ${error.message}`;
    }
    if (error instanceof Error) {
        return `${label}: ${error.message}`;
    }
    return `${label}: lỗi không xác định`;
}

export function SubscriptionsPanel() {
    const [days, setDays] = useState(30);
    const [keyword, setKeyword] = useState("");
    const [activePage, setActivePage] = useState(0);
    const [transactionPage, setTransactionPage] = useState(0);
    const [status, setStatus] = useState<TransactionStatus | "">("");
    const [provider, setProvider] = useState<PaymentProvider | "">("");

    const dateRange = useMemo(() => {
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - days + 1);
        return { from: from.toISOString(), to: to.toISOString() };
    }, [days]);

    const cleanKeyword = keyword.trim();
    const statsQuery = useSubscriptionStats(days);
    const activeQuery = useActiveSubscriptions({
        keyword: cleanKeyword || undefined,
        page: activePage,
        size: 10,
    });
    const transactionsQuery = useSubscriptionTransactions({
        keyword: cleanKeyword || undefined,
        status: status || undefined,
        provider: provider || undefined,
        from: dateRange.from,
        to: dateRange.to,
        page: transactionPage,
        size: 15,
    });

    const stats = statsQuery.data;

    function resetSearch(value: string) {
        setKeyword(value);
        setActivePage(0);
        setTransactionPage(0);
    }

    return (
        <div className="space-y-6 pt-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">Subscriptions</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Premium đang active và lịch sử giao dịch thanh toán.
                    </p>
                </div>
                <div className="flex rounded-md border p-1">
                    {DAY_OPTIONS.map((option) => (
                        <button
                            key={option}
                            onClick={() => {
                                setDays(option);
                                setTransactionPage(0);
                            }}
                            className={`rounded px-3 py-1.5 text-sm ${days === option ? "bg-black text-white" : "hover:bg-gray-100"}`}
                        >
                            {option} ngày
                        </button>
                    ))}
                </div>
            </div>

            {(statsQuery.isError || activeQuery.isError || transactionsQuery.isError) && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    Không thể tải Subscriptions. Cần backend admin API /admin/subscriptions.
                    {[formatError("Stats", statsQuery.error), formatError("Active", activeQuery.error), formatError("Transactions", transactionsQuery.error)]
                        .filter(Boolean)
                        .map((message) => (
                            <span key={message} className="mt-1 block">
                                {message}
                            </span>
                        ))}
                </p>
            )}

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <MetricCard icon={Crown} label="Premium active" value={formatNumber(stats?.activePremium)} />
                <MetricCard icon={CreditCard} label="Monthly active" value={formatNumber(stats?.monthlyActive)} />
                <MetricCard icon={WalletCards} label="Yearly active" value={formatNumber(stats?.yearlyActive)} />
                <MetricCard icon={ReceiptText} label="Paid transactions" value={formatNumber(stats?.paidTransactions)} />
                <MetricCard icon={WalletCards} label="Revenue paid" value={formatMoney(stats?.revenuePaidVnd)} />
            </div>

            <div className="flex flex-wrap gap-2">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        value={keyword}
                        onChange={(event) => resetSearch(event.target.value)}
                        placeholder="Tìm email, tên, order code..."
                        className="w-80 rounded-md border py-2 pl-9 pr-3 text-sm"
                    />
                </div>
                <select
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value as TransactionStatus | "");
                        setTransactionPage(0);
                    }}
                    className="rounded-md border px-3 py-2 text-sm"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">PENDING</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="FAILED">FAILED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
                <select
                    value={provider}
                    onChange={(event) => {
                        setProvider(event.target.value as PaymentProvider | "");
                        setTransactionPage(0);
                    }}
                    className="rounded-md border px-3 py-2 text-sm"
                >
                    <option value="">Tất cả provider</option>
                    <option value="MOMO">MOMO</option>
                </select>
                {(activeQuery.isFetching || transactionsQuery.isFetching) && (
                    <span className="self-center text-xs text-muted-foreground">Đang cập nhật...</span>
                )}
            </div>

            <section className="space-y-3">
                <h3 className="font-semibold">Premium đang active</h3>
                {activeQuery.isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
                {activeQuery.data && (
                    <>
                        <div className="overflow-hidden rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-3 py-2">User</th>
                                        <th className="px-3 py-2">Plan</th>
                                        <th className="px-3 py-2">Billing</th>
                                        <th className="px-3 py-2">Bắt đầu</th>
                                        <th className="px-3 py-2">Hết hạn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeQuery.data.items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                                                Không có subscription active.
                                            </td>
                                        </tr>
                                    )}
                                    {activeQuery.data.items.map((item) => (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-3 py-2">
                                                <p>{item.userFullName ?? item.userEmail}</p>
                                                <p className="text-xs text-muted-foreground">{item.userEmail}</p>
                                            </td>
                                            <td className="px-3 py-2">{item.plan}</td>
                                            <td className="px-3 py-2">{item.billingCycle ?? "-"}</td>
                                            <td className="px-3 py-2">{formatDate(item.startedAt)}</td>
                                            <td className="px-3 py-2">{formatDate(item.expiresAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={activeQuery.data.currentPage}
                            totalPages={activeQuery.data.totalPages}
                            totalItems={activeQuery.data.totalItems}
                            hasNext={activeQuery.data.hasNext}
                            onPrev={() => setActivePage((page) => page - 1)}
                            onNext={() => setActivePage((page) => page + 1)}
                        />
                    </>
                )}
            </section>

            <section className="space-y-3">
                <h3 className="font-semibold">Lịch sử giao dịch</h3>
                {transactionsQuery.isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
                {transactionsQuery.data && (
                    <>
                        <div className="overflow-hidden rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-3 py-2">Order</th>
                                        <th className="px-3 py-2">User</th>
                                        <th className="px-3 py-2">Plan</th>
                                        <th className="px-3 py-2 text-right">Amount</th>
                                        <th className="px-3 py-2">Provider</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Paid at</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactionsQuery.data.items.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                                                Không có giao dịch phù hợp.
                                            </td>
                                        </tr>
                                    )}
                                    {transactionsQuery.data.items.map((item) => (
                                        <tr key={item.id} className="border-t align-top">
                                            <td className="px-3 py-2">
                                                <p className="font-mono text-xs">{item.orderCode}</p>
                                                {item.providerTransactionId && (
                                                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                                                        {item.providerTransactionId}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-3 py-2">
                                                <p>{item.userFullName ?? item.userEmail}</p>
                                                <p className="text-xs text-muted-foreground">{item.userEmail}</p>
                                            </td>
                                            <td className="px-3 py-2">{item.plan}</td>
                                            <td className="px-3 py-2 text-right">{formatMoney(item.amount)}</td>
                                            <td className="px-3 py-2">{item.provider}</td>
                                            <td className="px-3 py-2"><TransactionStatusBadge status={item.status} /></td>
                                            <td className="px-3 py-2">{formatDate(item.paidAt ?? item.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={transactionsQuery.data.currentPage}
                            totalPages={transactionsQuery.data.totalPages}
                            totalItems={transactionsQuery.data.totalItems}
                            hasNext={transactionsQuery.data.hasNext}
                            onPrev={() => setTransactionPage((page) => page - 1)}
                            onNext={() => setTransactionPage((page) => page + 1)}
                        />
                    </>
                )}
            </section>
        </div>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-md border bg-white p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
    );
}

function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
    const className =
        status === "SUCCESS"
            ? "bg-green-100 text-green-700"
            : status === "PENDING"
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700";

    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>{status}</span>;
}

function Pagination({
    currentPage,
    totalPages,
    totalItems,
    hasNext,
    onPrev,
    onNext,
}: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span>
                Trang {currentPage + 1} / {Math.max(totalPages, 1)} - {totalItems} mục
            </span>
            <div className="flex gap-2">
                <button
                    disabled={currentPage === 0}
                    onClick={onPrev}
                    className="rounded-md border px-3 py-1 disabled:opacity-40"
                >
                    Trước
                </button>
                <button
                    disabled={!hasNext}
                    onClick={onNext}
                    className="rounded-md border px-3 py-1 disabled:opacity-40"
                >
                    Sau
                </button>
            </div>
        </div>
    );
}
