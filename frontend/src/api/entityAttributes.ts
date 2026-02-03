import { EntityAttributeCreateRequest, EntityAttributeUpdateRequest, EntityAttributeResponse } from "@types";
import apiClient from "./client";

const ENDPOINT = "/entity_attributes";

export const getEntityAttributes = async (entityTypeId: number): Promise<EntityAttributeResponse[]> => {
    const response = await apiClient.get(`${ENDPOINT}/${entityTypeId}`);
    return response.data;
}

export const getEntityAttributeById = async (entityTypeId: number, id: number): Promise<EntityAttributeResponse> => {
    const response = await apiClient.get(`${ENDPOINT}/${entityTypeId}/${id}`);
    return response.data;
}

export const createEntityAttribute = async (entityTypeId: number, entityAttribute: EntityAttributeCreateRequest): Promise<EntityAttributeResponse> => {
    const response = await apiClient.post(`${ENDPOINT}/${entityTypeId}`, entityAttribute);
    return response.data;
}

export const updateEntityAttribute = async (entityTypeId: number, id: number, entityAttribute: EntityAttributeUpdateRequest): Promise<EntityAttributeResponse> => {
    const response = await apiClient.patch(`${ENDPOINT}/${entityTypeId}/${id}`, entityAttribute);
    return response.data;
}

export const deleteEntityAttribute = async (entityTypeId: number, id: number): Promise<void> => {
    const response = await apiClient.delete(`${ENDPOINT}/${entityTypeId}/${id}`);
    return response.data;
}

