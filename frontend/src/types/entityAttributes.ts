import { EntityAttributeType } from "./enums";

export type EntityAttributeResponse = {
    id: number;
    name: string;
    description: string;
    is_primary: boolean;
    type: EntityAttributeType;
    required: boolean;
    attribute_order: number;
}

export type EntityAttributeCreateRequest = {
    name: string;
    description?: string;
    is_primary?: boolean;
    type: EntityAttributeType;
    required?: boolean;
    attribute_order?: number;
}

export type EntityAttributeUpdateRequest = {
    name?: string;
    description?: string;
    is_primary?: boolean;
    type?: EntityAttributeType;
    required?: boolean;
    attribute_order?: number;
}