import apiClient from './client';

export type WorkspaceSettings = {
  canonical_data_language: string;
};

export async function getWorkspaceSettings(): Promise<WorkspaceSettings> {
  const res = await apiClient.get('/workspace_settings');
  return res.data;
}

export async function updateWorkspaceSettings(
  payload: WorkspaceSettings
): Promise<WorkspaceSettings> {
  const res = await apiClient.patch('/workspace_settings', payload);
  return res.data;
}
