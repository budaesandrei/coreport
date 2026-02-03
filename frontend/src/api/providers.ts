import { ProviderCreateRequest, ProviderUpdateRequest, ProviderResponse } from "@types";
import apiClient from "./client";

const ENDPOINT = "/providers";

export const getProviders = async (): Promise<ProviderResponse[]> => {
    const response = await apiClient.get(ENDPOINT);
    return response.data;
}

export const getProviderById = async (id: number): Promise<ProviderResponse> => {
    const response = await apiClient.get(`${ENDPOINT}/${id}`);
    return response.data;
}

export const createProvider = async (provider: ProviderCreateRequest): Promise<ProviderResponse> => {
    const response = await apiClient.post(ENDPOINT, provider);
    return response.data;
}

export const updateProvider = async (id: number, provider: ProviderUpdateRequest): Promise<ProviderResponse> => {
    const response = await apiClient.patch(`${ENDPOINT}/${id}`, provider);
    return response.data;
}

export const deleteProvider = async (id: number): Promise<void> => {
    const response = await apiClient.delete(`${ENDPOINT}/${id}`);
    return response.data;
}

