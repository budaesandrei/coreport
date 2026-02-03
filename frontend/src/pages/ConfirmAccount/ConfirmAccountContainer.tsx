import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmSignUp } from 'aws-amplify/auth';
import ConfirmAccountPresentation from './ConfirmAccountPresentation';

const ConfirmAccountContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async (code: string) => {
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmAccountPresentation
      email={email}
      digits={digits}
      loading={loading}
      error={error}
      setDigits={setDigits}
      onConfirm={handleConfirm}
    />
  );
};

export default ConfirmAccountContainer;
