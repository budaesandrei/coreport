import { ProjectResolveRequest, ProjectInfoResponse } from "@types";
import apiClient from "./client";

const ENDPOINT = "/projects";

export const getProjectByName = async (projectResolveRequest: ProjectResolveRequest): Promise<ProjectInfoResponse> => {
    const response = await apiClient.post(`${ENDPOINT}/resolve`, projectResolveRequest);
    return response.data;
};