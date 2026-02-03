import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import LoginPresentation from './LoginPresentation';
import { LoginFormData } from './props';
import apiClient from '@api/client';

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
      const projectIdStr = localStorage.getItem('project_id');
      const projectId = projectIdStr ? Number(projectIdStr) : 0;
      if (!projectId) {
        setSnackbar({
          open: true,
          message: 'Please select a project first',
          severity: 'error'
        });
        return;
      }

      setLoading(true);
      const resp = await apiClient.post('/auth/login', {
        project_id: projectId,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem('coreport.token', resp.data.access_token);
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

  const handleGoogleSignIn = async () => {
    setSnackbar({
      open: true,
      message: 'Google sign-in is not enabled in local auth mode',
      severity: 'error'
    });
  };

  const handleMicrosoftSignIn = async () => {
    setSnackbar({
      open: true,
      message: 'Microsoft sign-in is not enabled in local auth mode',
      severity: 'error'
    });
  };

  return (
    <>
      <LoginPresentation
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onMicrosoftSignIn={handleMicrosoftSignIn}
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
