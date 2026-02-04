// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@router/AppRouter';
import { UserProvider } from '@context/UserContext';
import { ThemeProvider } from '@context/ThemeContext';
import { NotificationsProvider } from '@context/NotificationsContext';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CssBaseline />
        <UserProvider>
          <NotificationsProvider>
            <AppRouter />
          </NotificationsProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;