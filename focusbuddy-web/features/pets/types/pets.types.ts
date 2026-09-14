export interface AdminPetResponse {
    id: number;
    code: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    premium: boolean;
}

export interface UpdatePetRequest {
    name: string;
    description?: string;
    imageUrl?: string;
    premium: boolean;
}