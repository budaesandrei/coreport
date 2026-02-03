import { styled } from '@mui/material/styles';
import { Paper, Box, Typography, TextField } from '@mui/material';

export const ConfirmAccountContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '20px',
  background: `
    radial-gradient(circle at 10% 20%, ${theme.palette.primary.main}30 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, ${theme.palette.secondary.main}90 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, ${theme.palette.info.main}25 0%, transparent 60%),
    linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 50%, ${theme.palette.info.main}05 100%)
  `,
}));

export const ConfirmAccountPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '400px',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(12px)',
  border: `1px solid ${theme.palette.divider}30`,
  backgroundColor: `${theme.palette.background.paper}55`,
}));

export const LogoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(2),
}));

export const Logo = styled('img')({
  width: '48px',
  height: '48px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))',
});

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

export const CompanyName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '0.5px',
  color: theme.palette.primary.main,
  textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
})) as typeof Typography;

export const Tagline = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  textAlign: 'center',
  maxWidth: '300px',
  lineHeight: 1.5,
}));

export const InputsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: theme.spacing(2),
  gap: theme.spacing(1),
}));

export const StyledInput = styled(TextField)(({ theme }) => ({
  width: '48px',
  '& input': {
    textAlign: 'center',
    fontSize: '1.5rem',
    padding: theme.spacing(1),
  },
}));
