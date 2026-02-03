// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@router/AppRouter';
import { UserProvider } from '@context/UserContext';
import { ThemeProvider } from '@context/ThemeContext';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CssBaseline />
        <UserProvider>
          <AppRouter />
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;