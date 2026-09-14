export interface PromptTemplateResponse {
    id: number;
    promptKey: string;
    template: string;
    updatedAt: string;
}

export interface UpdatePromptTemplateRequest {
    template: string;
}