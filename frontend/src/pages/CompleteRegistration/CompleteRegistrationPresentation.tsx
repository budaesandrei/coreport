import { useState } from 'react';
import { Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import {
  CompleteRegistrationContainer,
  CompleteRegistrationPaper,
  Logo,
  LogoContainer,
  HeaderContainer,
  CompanyName,
  Tagline,
  StyledTextField,
  StyledButton,
  ErrorMessage,
  Divider,
} from './styles';
import logoDark from '@assets/images/logo_dark.webp';
import logoWhite from '@assets/images/logo_white.webp';

type Props = {
  token: string | null;
  data: any;
  detailsLoading: boolean;
  loading: boolean;
  error: string | null;
  onSubmit: (data: { password: string; confirmPassword: string }) => void;
  onGoogleSignIn: () => void;
  onMicrosoftSignIn: () => void;
};

const CompleteRegistrationPresentation = ({ 
  token, 
  data, 
  detailsLoading,
  loading, 
  error, 
  onSubmit,
  onGoogleSignIn,
  onMicrosoftSignIn 
}: Props) => {
  const theme = useTheme();
  const [isDarkMode] = useState(theme.palette.mode === 'dark');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    onSubmit({ password, confirmPassword });
  };

  if (detailsLoading) {
    return (
      <CompleteRegistrationContainer>
        <CompleteRegistrationPaper elevation={3}>
          <HeaderContainer>
            <LogoContainer>
              <Logo
                src={isDarkMode ? logoWhite : logoDark}
                alt="COREPORT Logo"
              />
              <CompanyName variant="h4" component="h1">
                COREPORT
              </CompanyName>
            </LogoContainer>
            <Tagline variant="subtitle1" color="text.secondary">
              Loading...
            </Tagline>
          </HeaderContainer>
        </CompleteRegistrationPaper>
      </CompleteRegistrationContainer>
    );
  }

  if (error) {
    return (
      <CompleteRegistrationContainer>
        <CompleteRegistrationPaper elevation={3}>
          <HeaderContainer>
            <LogoContainer>
              <Logo
                src={isDarkMode ? logoWhite : logoDark}
                alt="COREPORT Logo"
              />
              <CompanyName variant="h4" component="h1">
                COREPORT
              </CompanyName>
            </LogoContainer>
            <ErrorMessage variant="body1">
              {error}
            </ErrorMessage>
            <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
          </HeaderContainer>
        </CompleteRegistrationPaper>
      </CompleteRegistrationContainer>
    );
  }

  if (!data) return null;

  return (
    <CompleteRegistrationContainer>
      <CompleteRegistrationPaper elevation={3}>
        <HeaderContainer>
          <LogoContainer>
            <Logo
              src={isDarkMode ? logoWhite : logoDark}
              alt="COREPORT Logo"
            />
            <CompanyName variant="h4" component="h1">
              COREPORT
            </CompanyName>
          </LogoContainer>
          <Tagline variant="subtitle1" color="text.secondary">
            Complete registration for <strong>{data.project.name}</strong>
          </Tagline>
        </HeaderContainer>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <StyledTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            fullWidth
            margin="normal"
          />

          <StyledTextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            fullWidth
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
          />

          <StyledButton
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            Complete Registration
          </StyledButton>
        </form>

        <Divider>or</Divider>

        <StyledButton
          variant="outlined"
          onClick={onGoogleSignIn}
          disabled={loading}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </StyledButton>

        <StyledButton
          variant="outlined"
          onClick={onMicrosoftSignIn}
          disabled={loading}
          startIcon={<MicrosoftIcon />}
          sx={{ mt: 2 }}
        >
          Sign in with Microsoft
        </StyledButton>
      </CompleteRegistrationPaper>
    </CompleteRegistrationContainer>
  );
};

export default CompleteRegistrationPresentation;
  