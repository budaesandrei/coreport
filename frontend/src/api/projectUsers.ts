import { ProjectUserCreateRequest, ProjectUserUpdateRequest, ProjectUserResponse } from "@types";
import apiClient from "./client";

const ENDPOINT = "/project_users";

export const getProjectUsers = async (): Promise<ProjectUserResponse[]> => {
    const response = await apiClient.get(ENDPOINT);
    return response.data;
}

export const getProjectUserById = async (id: number): Promise<ProjectUserResponse> => {
    const response = await apiClient.get(`${ENDPOINT}/${id}`);
    return response.data;
}

export const createProjectUser = async (projectUser: ProjectUserCreateRequest): Promise<ProjectUserResponse> => {
    const response = await apiClient.post(ENDPOINT, projectUser);
    return response.data;
}

export const updateProjectUser = async (id: number, projectUser: ProjectUserUpdateRequest): Promise<ProjectUserResponse> => {
    const response = await apiClient.patch(`${ENDPOINT}/${id}`, projectUser);
    return response.data;
}

export const deleteProjectUser = async (id: number): Promise<void> => {
    const response = await apiClient.delete(`${ENDPOINT}/${id}`);
    return response.data;
}

