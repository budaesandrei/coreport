import React, { useState } from 'react';
import CompleteRegistrationPresentation from './CompleteRegistrationPresentation';
import { useCompleteRegistration } from '@hooks/useCompleteRegistration';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { signUp, signInWithRedirect } from 'aws-amplify/auth';

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
      await signUp({
        username: data.email,
        password: password,
      });

      localStorage.setItem("invite_token", token!);

      setSnackbar({
        open: true,
        message: 'Check your email to confirm your account',
        severity: 'success',
      });

      navigate('/confirm-account', { state: { email: data.email } });
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
    try {
      setLoading(true);
      if (token) localStorage.setItem("invite_token", token);
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to sign in with Google',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setLoading(true);
      if (token) localStorage.setItem("invite_token", token);
      await signInWithRedirect({ provider: { custom: 'LoginWithMicrosoft' } });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to sign in with Microsoft',
        severity: 'error'
      });
      setLoading(false);
    }
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
