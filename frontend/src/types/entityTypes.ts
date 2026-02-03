export type EntityTypeResponse = {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

export type EntityTypeCreateRequest = {
    name: string;
    description?: string;
    is_active?: boolean;
}

export type EntityTypeUpdateRequest = {
    name?: string;
    description?: string;
    is_active?: boolean;
}