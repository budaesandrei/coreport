import { EntityTypeCreateRequest, EntityTypeUpdateRequest, EntityTypeResponse } from "@types";
import apiClient from "./client";

const ENDPOINT = "/entity_types";

export const getEntityTypes = async (): Promise<EntityTypeResponse[]> => {
    const response = await apiClient.get(ENDPOINT);
    return response.data;
}

export const getEntityTypeById = async (id: number): Promise<EntityTypeResponse> => {
    const response = await apiClient.get(`${ENDPOINT}/${id}`);
    return response.data;
}

export const createEntityType = async (entityType: EntityTypeCreateRequest): Promise<EntityTypeResponse> => {
    const response = await apiClient.post(ENDPOINT, entityType);
    return response.data;
}

export const updateEntityType = async (id: number, entityType: EntityTypeUpdateRequest): Promise<EntityTypeResponse> => {
    const response = await apiClient.patch(`${ENDPOINT}/${id}`, entityType);
    return response.data;
}

export const deleteEntityType = async (id: number): Promise<void> => {
    const response = await apiClient.delete(`${ENDPOINT}/${id}`);
    return response.data;
}

