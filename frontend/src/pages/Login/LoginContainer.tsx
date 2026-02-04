import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import LoginPresentation from './LoginPresentation';
import { LoginFormData } from './props';
import apiClient from '@api/client';
import { notifyAuthChanged } from '@hooks/useAuth';

export default function LoginContainer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'success' }>({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSignIn = async (data: LoginFormData) => {
    try {
      const workspaceId = localStorage.getItem('workspace_id');
      if (!workspaceId) {
        setSnackbar({
          open: true,
          message: 'Please select a workspace first',
          severity: 'error'
        });
        return;
      }

      setLoading(true);
      const resp = await apiClient.post('/auth/login', {
        workspace_slug: workspaceId,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem('coreport.token', resp.data.access_token);
      notifyAuthChanged();
      navigate('/');
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.detail || 'Invalid email or password',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: LoginFormData, projectName: string) => {
    try {
      const trimmed = projectName.trim();
      if (!trimmed) {
        setSnackbar({
          open: true,
          message: 'Please select a workspace first',
          severity: 'error',
        });
        return;
      }

      setLoading(true);
      const registerResp = await apiClient.post('/auth/register', {
        workspace_name: trimmed,
        email: data.email,
        password: data.password,
      });

      localStorage.setItem('coreport.token', registerResp.data.access_token);
      notifyAuthChanged();
      navigate('/');
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.detail || error?.message || 'Failed to create account',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginPresentation
        onSignIn={handleSignIn}
        onRegister={handleRegister}
        loading={loading}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
