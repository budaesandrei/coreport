import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Slide, useTheme } from '@mui/material';
import { FormControl, FormHelperText } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
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
  Divider,
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

type Step = 'project' | 'login';

export default function LoginPresentation({
  onSignIn,
  onGoogleSignIn,
  onMicrosoftSignIn,
  loading,
}: LoginPresentationProps) {
  const theme = useTheme();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: formDefaultValues,
  });
  const [isDarkMode] = useState(theme.palette.mode === 'dark');
  const [step, setStep] = useState<Step>('project');
  const [projectName, setProjectName] = useState('');
  const [projectError, setProjectError] = useState('');
  const [
    { data: projectData, loading: projectLoading, error: hookProjectError },
    resolveProject
  ] = useProjectInfo();

  useEffect(() => {
    if (projectData) {
      localStorage.setItem('project_id', projectData.id.toString());
      setStep('login');
    }
  }, [projectData]);

  const handleProjectContinue = async () => {
    const trimmed = projectName.trim();
    if (!trimmed) {
      setProjectError('Please enter your team/project name');
      return;
    }
    setProjectError('');
    await resolveProject({ name: trimmed });
  };

  const onSubmit = (data: LoginFormData) => {
    onSignIn(data);
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
          {/* Step 1: Project Name */}
          <Slide direction="right" in={step === 'project'} mountOnEnter unmountOnExit>
            <form style={{ width: '100%' }} onSubmit={(e) => { e.preventDefault(); handleProjectContinue(); }}>
              <FormControl fullWidth error={!!(projectError || hookProjectError)}>
                <StyledTextField
                  label="Project Name"
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
          
          {/* Step 2: Login */}
          <Slide direction="left" in={step === 'login'} mountOnEnter unmountOnExit>
            <div>
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
                    autoComplete="current-password"
                  />
                  {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                </FormControl>
                
                <StyledButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  Sign In
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
            </div>
          </Slide>
        </FormContainer>
      </LoginPaper>
    </LoginContainer>
  );
} 