export interface AdminUser {
    id: number;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    addressLine: string | null;
    provinceCode: number | null;
    provinceName: string | null;
    wardCode: number | null;
    wardName: string | null;
    createdAt: string;
    passwordUpdatedAt: string | null;
    profileCompleted: boolean;
    aiSelfAddress: string | null;
    aiUserAddress: string | null;
    onboardingCompleted: boolean;
    personalityId: number | null;
    personalityCode: string | null;
    roles: string[];
    preferredLanguage: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}


export interface LoginApiData {
    accessToken: string;
    tokenType: string;
    user: AdminUser;
}

export interface AuthApiResponse<T> {
    success: boolean;
    code?: string;
    message?: string;
    data?: T;
}