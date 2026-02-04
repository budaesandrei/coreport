import apiClient from './client';

export type UserSettings = {
  ui_language: string;
};

export async function getUserSettings(): Promise<UserSettings> {
  const res = await apiClient.get('/user_settings');
  return res.data;
}

export async function updateUserSettings(payload: UserSettings): Promise<UserSettings> {
  const res = await apiClient.patch('/user_settings', payload);
  return res.data;
}
