import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Avatar,
  Tooltip,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUser } from '@context/UserContext';
import { useThemeContext } from '@context/ThemeContext';
import { useNotifications } from '@context/NotificationsContext';
import { notifyAuthChanged } from '@hooks/useAuth';
import logoDark from '@assets/images/logo_nav.webp';

const Topbar: React.FC<{ topbarHeight: number }> = ({ topbarHeight }) => {
  const { name } = useUser();
  const { mode, toggleTheme } = useThemeContext();
  const { unreadCount, togglePanel } = useNotifications();
  const navigate = useNavigate();

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(userMenuAnchor);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => setUserMenuAnchor(null);

  const handleLogout = () => {
    // Auth
    localStorage.removeItem('coreport.token');

    // Workspace context
    localStorage.removeItem('workspace_id');
    localStorage.removeItem('workspace_name');

    // Other auth-ish values
    localStorage.removeItem('invite_token');

    notifyAuthChanged();
    handleCloseUserMenu();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar
      position="relative"
      elevation={0}
      color="default"
      sx={{
        backgroundColor: 'transparent',
        width: "100%",
        height: topbarHeight,
        borderRadius: 0,
        p: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        py: 0.5,
        minHeight: `${topbarHeight}px !important`
      }}>
        {/* Left: Logo and Company Name */}
        <Box display="flex" alignItems="center" gap={2}>
          <img 
            src={logoDark} 
            alt="Coreport Logo" 
            style={{ height: '40px', width: 'auto' }} 
          />
          <Divider 
            orientation="vertical" 
            flexItem 
            sx={{ 
              height: '24px',
              my: 'auto',
              borderColor: 'text.primary'
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              fontFamily: 'Righteous, cursive'
            }}
          >
            CO<span style={{ color: '#4fb0c1' }}>RE</span>PORT
          </Typography>
        </Box>

        {/* Middle: Search Bar */}
        <Box sx={{ flex: 1, maxWidth: 400, mx: 4 }}>
          <TextField
            fullWidth
            placeholder="Search..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              },
            }}
          />
        </Box>

        {/* Right: Icon buttons */}
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <IconButton size="small" onClick={toggleTheme}>
              {mode === 'light' ? (
                <DarkModeIcon sx={{ fontSize: '1.25rem' }} />
              ) : (
                <LightModeIcon sx={{ fontSize: '1.25rem' }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              edge="end"
              aria-label="Notifications"
              onClick={togglePanel}
            >
              <Badge
                color="error"
                badgeContent={unreadCount}
                overlap="circular"
                invisible={unreadCount <= 0}
                slotProps={{ badge: { 'data-testid': 'notifications-badge' } }}
              >
                <NotificationsIcon sx={{ fontSize: '1.25rem' }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title={name}>
            <IconButton size="small" aria-label="User menu" onClick={handleOpenUserMenu}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={userMenuAnchor}
            open={userMenuOpen}
            onClose={handleCloseUserMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
