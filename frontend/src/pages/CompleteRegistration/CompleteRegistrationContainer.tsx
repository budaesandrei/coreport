import React, { useState } from 'react';
import CompleteRegistrationPresentation from './CompleteRegistrationPresentation';
import { useCompleteRegistration } from '@hooks/useCompleteRegistration';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import apiClient from '@api/client';
import { patchAcceptInvitationByToken } from '@api';

const CompleteRegistrationContainer: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { token, data, loading: detailsLoading, error } = useCompleteRegistration();

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'success' }>({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async ({ password }: { password: string; confirmPassword: string }) => {
    if (!data) return;

    try {
      setLoading(true);
      const registerResp = await apiClient.post('/auth/register', {
        project_name: data.project.name,
        email: data.email,
        password: password,
      });

      if (token) {
        await patchAcceptInvitationByToken(token);
      }

      localStorage.setItem('coreport.token', registerResp.data.access_token);
      if (token) {
        localStorage.removeItem('invite_token');
      }

      setSnackbar({
        open: true,
        message: 'Registration complete',
        severity: 'success',
      });

      navigate('/');
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to complete registration',
        severity: 'error',
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
      <CompleteRegistrationPresentation
        token={token}
        data={data}
        detailsLoading={detailsLoading}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        onMicrosoftSignIn={handleMicrosoftSignIn}
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
};

export default CompleteRegistrationContainer;
