import { apiClient } from "@/lib/apiClient";
import type {
    ActiveSubscriptionsPage,
    ListActiveSubscriptionsParams,
    ListTransactionsParams,
    SubscriptionStats,
    TransactionsPage,
} from "../types/subscriptions.types";

function buildActiveQuery(params: ListActiveSubscriptionsParams): string {
    const query = new URLSearchParams();
    if (params.keyword) query.set("keyword", params.keyword);
    query.set("page", String(params.page ?? 0));
    query.set("size", String(params.size ?? 20));
    return query.toString();
}

function buildTransactionQuery(params: ListTransactionsParams): string {
    const query = new URLSearchParams();
    if (params.keyword) query.set("keyword", params.keyword);
    if (params.status) query.set("status", params.status);
    if (params.provider) query.set("provider", params.provider);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    query.set("page", String(params.page ?? 0));
    query.set("size", String(params.size ?? 20));
    return query.toString();
}

export const subscriptionsApi = {
    getStats: (days: number) =>
        apiClient.get<SubscriptionStats>(`/api/admin/admin/subscriptions/stats?days=${days}`),

    listActive: (params: ListActiveSubscriptionsParams) =>
        apiClient.get<ActiveSubscriptionsPage>(
            `/api/admin/admin/subscriptions/active?${buildActiveQuery(params)}`,
        ),

    listTransactions: (params: ListTransactionsParams) =>
        apiClient.get<TransactionsPage>(
            `/api/admin/admin/subscriptions/transactions?${buildTransactionQuery(params)}`,
        ),
};
