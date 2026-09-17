"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { subscriptionsApi } from "../api/subscriptions.api";
import type { ListActiveSubscriptionsParams, ListTransactionsParams } from "../types/subscriptions.types";

export function useSubscriptionStats(days: number) {
    return useQuery({
        queryKey: ["admin-subscription-stats", days],
        queryFn: () => subscriptionsApi.getStats(days),
    });
}

export function useActiveSubscriptions(params: ListActiveSubscriptionsParams) {
    return useQuery({
        queryKey: ["admin-active-subscriptions", params],
        queryFn: () => subscriptionsApi.listActive(params),
        placeholderData: keepPreviousData,
    });
}

export function useSubscriptionTransactions(params: ListTransactionsParams) {
    return useQuery({
        queryKey: ["admin-subscription-transactions", params],
        queryFn: () => subscriptionsApi.listTransactions(params),
        placeholderData: keepPreviousData,
    });
}
