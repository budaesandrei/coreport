export type ProviderResponse = {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

export type ProviderCreateRequest = {
    name: string;
    description?: string;
    is_active?: boolean;
}

export type ProviderUpdateRequest = {
    name?: string;
    description?: string;
    is_active?: boolean;
}