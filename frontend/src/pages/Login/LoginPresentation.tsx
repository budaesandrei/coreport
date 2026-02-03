import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Slide, useTheme, Button, Stack, Typography } from '@mui/material';
import { FormControl, FormHelperText } from '@mui/material';
import {
  LoginContainer,
  LoginPaper,
  Logo,
  LogoContainer,
  HeaderContainer,
  CompanyName,
  Tagline,
  StyledTextField,
  StyledButton,
  FormContainer,
} from './styles';
import {
  LoginPresentationProps,
  LoginFormData,
  formDefaultValues,
  formValidationRules
} from './props';
import logoDark from '@assets/images/logo_dark.webp';
import logoWhite from '@assets/images/logo_white.webp';
import { useProjectInfo } from '@hooks/useProjectInfo';

type Step = 'project' | 'auth';
type AuthMode = 'login' | 'register';

export default function LoginPresentation({
  onSignIn,
  onRegister,
  loading,
}: LoginPresentationProps) {
  const theme = useTheme();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: formDefaultValues,
  });
  const [isDarkMode] = useState(theme.palette.mode === 'dark');
  const [step, setStep] = useState<Step>('project');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [projectName, setProjectName] = useState('');
  const [projectError, setProjectError] = useState('');
  const [
    { data: projectData, loading: projectLoading, error: hookProjectError },
    resolveProject
  ] = useProjectInfo();

  useEffect(() => {
    if (projectData) {
      localStorage.setItem('project_id', projectData.id.toString());
      setStep('auth');
    }
  }, [projectData]);

  const handleProjectContinue = async () => {
    const trimmed = projectName.trim();
    if (!trimmed) {
      setProjectError('Please enter your workspace name');
      return;
    }

    setProjectError('');
    // Keep the exact workspace name used in step 1 so Create Account can use it.
    localStorage.setItem('project_name', trimmed);
    await resolveProject({ name: trimmed });
  };

  const onSubmit = (data: LoginFormData) => {
    if (authMode === 'login') {
      onSignIn(data);
      return;
    }
    onRegister(data, projectName);
  };

  return (
    <LoginContainer>
      <LoginPaper elevation={3}>
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
            Your file submission platform
          </Tagline>
        </HeaderContainer>

        <FormContainer>
          {/* Step 1: Workspace */}
          <Slide direction="right" in={step === 'project'} mountOnEnter unmountOnExit>
            <form style={{ width: '100%' }} onSubmit={(e) => { e.preventDefault(); handleProjectContinue(); }}>
              <FormControl fullWidth error={!!(projectError || hookProjectError)}>
                <StyledTextField
                  label="Workspace"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={loading || projectLoading}
                />
                {(projectError || hookProjectError) && <FormHelperText>{projectError || hookProjectError}</FormHelperText>}
              </FormControl>

              <StyledButton
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={projectLoading}
              >
                Continue
              </StyledButton>
            </form>
          </Slide>

          {/* Step 2: Auth */}
          <Slide direction="left" in={step === 'auth'} mountOnEnter unmountOnExit>
            <div>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {authMode === 'login' ? 'Sign in' : 'Create account'}
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setStep('project')}
                  disabled={loading}
                >
                  Change workspace
                </Button>
              </Stack>

              <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                <FormControl fullWidth error={!!errors.email}>
                  <StyledTextField
                    {...register('email', formValidationRules.email)}
                    label="Email"
                    type="email"
                    disabled={loading}
                    autoComplete="email"
                  />
                  {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth error={!!errors.password} sx={{ mt: 2 }}>
                  <StyledTextField
                    {...register('password', formValidationRules.password)}
                    label="Password"
                    type="password"
                    disabled={loading}
                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  />
                  {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                </FormControl>

                <StyledButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </StyledButton>
              </form>

              <Button
                variant="text"
                size="small"
                onClick={() => setAuthMode((m) => (m === 'login' ? 'register' : 'login'))}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {authMode === 'login' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
              </Button>
            </div>
          </Slide>
        </FormContainer>
      </LoginPaper>
    </LoginContainer>
  );
}
