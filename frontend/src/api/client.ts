import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('coreport.token');
  const storedProjectId = localStorage.getItem('project_id');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (storedProjectId) {
    config.headers['X-Project-Id'] = storedProjectId;
  }

  return config;
});

export default apiClient;
