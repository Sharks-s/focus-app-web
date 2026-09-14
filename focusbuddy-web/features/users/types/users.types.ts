export type UserStatus = "PENDING" | "ACTIVE" | "DEACTIVATED" | "SUSPENDED" | "BLOCKED";
export type UserGender = "MALE" | "FEMALE" | "OTHER";

export interface AdminUserListItem {
    id: number;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    status: UserStatus;
    isPremium: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

export interface AdminUserDetailResponse {
    id: number;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    phoneNumber: string | null;
    gender: UserGender | null;
    dateOfBirth: string | null;
    status: UserStatus;
    dailyUsedMinutes: number | null;
    onboardingCompleted: boolean;
    profileCompleted: boolean;
    personalityCode: string | null;
    roles: string[];
    isPremium: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    totalFocusSessions: number;
}

export interface PagedResponse<T> {
    items: T[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
}

export interface ListUsersParams {
    keyword?: string;
    status?: UserStatus;
    page?: number;
    size?: number;
}

///

export type RoleCode = "ADMIN" | "USER";

export interface UpdateUserRoleRequest {
    roleCode: RoleCode;
}