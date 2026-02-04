import { WorkspaceResolveRequest, WorkspaceInfoResponse } from "@types";
import apiClient from "./client";

const ENDPOINT = "/workspaces";

export const resolveWorkspaceByName = async (
  req: WorkspaceResolveRequest
): Promise<WorkspaceInfoResponse> => {
  const response = await apiClient.post(`${ENDPOINT}/resolve`, req);
  return response.data;
};
