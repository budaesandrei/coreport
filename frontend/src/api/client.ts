import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('coreport.token');
  const storedWorkspaceId = localStorage.getItem('workspace_id');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (storedWorkspaceId) {
    config.headers['X-Workspace-Id'] = storedWorkspaceId;
  }

  return config;
});

export default apiClient;
