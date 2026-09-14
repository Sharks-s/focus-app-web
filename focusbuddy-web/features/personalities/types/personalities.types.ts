export interface PersonalityResponse {
    id: number;
    code: string;
    name: string;
    description: string | null;
    isPremium: boolean;
}

export interface CreatePersonalityRequest {
    code: string;
    name: string;
    description?: string;
    isPremium: boolean;
}

export interface UpdatePersonalityRequest {
    code: string;
    name: string;
    description?: string;
    isPremium: boolean;
}