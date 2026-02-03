import { useRef } from 'react';
import {
  ConfirmAccountContainer,
  ConfirmAccountPaper,
  HeaderContainer,
  Logo,
  LogoContainer,
  CompanyName,
  Tagline,
  StyledInput,
  InputsWrapper,
} from './styles';
import logoDark from '@assets/images/logo_dark.webp';
import logoWhite from '@assets/images/logo_white.webp';
import { useTheme, Snackbar, Alert } from '@mui/material';

type Props = {
  email: string;
  digits: string[];
  loading: boolean;
  error: string | null;
  setDigits: (digits: string[]) => void;
  onConfirm: (code: string) => void;
};

const ConfirmAccountPresentation = ({
  email,
  digits,
  loading,
  error,
  setDigits,
  onConfirm,
}: Props) => {
  const theme = useTheme();
  const [isDarkMode] = [theme.palette.mode === 'dark'];
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[i] = val;
    setDigits(newDigits);

    if (val && i < 5) {
      inputsRef.current[i + 1]?.focus();
    }

    if (newDigits.every(d => d !== '')) {
      onConfirm(newDigits.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      const newDigits = [...digits];
      newDigits[i - 1] = '';
      setDigits(newDigits);
      inputsRef.current[i - 1]?.focus();
    }
  };

  return (
    <ConfirmAccountContainer>
      <ConfirmAccountPaper elevation={3}>
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
            Enter verification code<br />
            A 6-digit code was sent to <strong>{email}</strong>
          </Tagline>
        </HeaderContainer>

        <form>
          <InputsWrapper>
            {digits.map((digit, i) => (
              <StyledInput
                key={i}
                inputRef={(el) => (inputsRef.current[i] = el)}
                autoFocus={i === 0}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, i)}
                disabled={loading}
                slotProps={{
                    htmlInput: {
                        maxLength: 1
                    }
                }}
              />
            ))}
          </InputsWrapper>
        </form>
      </ConfirmAccountPaper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </ConfirmAccountContainer>
  );
};

export default ConfirmAccountPresentation;
