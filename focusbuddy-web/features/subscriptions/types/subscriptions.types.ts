import type { PagedResponse } from "@/features/users/types/users.types";

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
export type PaymentProvider = "MOMO";

export interface AdminActiveSubscriptionItem {
    id: number;
    userId: number;
    userEmail: string;
    userFullName: string | null;
    plan: string;
    billingCycle: string | null;
    startedAt: string | null;
    expiresAt: string | null;
    active: boolean;
    createdAt: string;
}

export interface AdminTransactionItem {
    id: number;
    userId: number;
    userEmail: string;
    userFullName: string | null;
    orderCode: string;
    plan: string;
    amount: number;
    provider: PaymentProvider;
    status: TransactionStatus;
    providerTransactionId?: string | null;
    subscriptionId?: number | null;
    paidAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionStats {
    activePremium: number;
    monthlyActive: number;
    yearlyActive: number;
    revenuePaidVnd: number;
    paidTransactions: number;
}

export interface ListActiveSubscriptionsParams {
    keyword?: string;
    page?: number;
    size?: number;
}

export interface ListTransactionsParams {
    keyword?: string;
    status?: TransactionStatus;
    provider?: PaymentProvider;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
}

export type ActiveSubscriptionsPage = PagedResponse<AdminActiveSubscriptionItem>;
export type TransactionsPage = PagedResponse<AdminTransactionItem>;
