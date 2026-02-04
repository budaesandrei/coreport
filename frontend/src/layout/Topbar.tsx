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
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useUser } from '@context/UserContext';
import { useThemeContext, ThemeModePreference } from '@context/ThemeContext';
import { useNotifications } from '@context/NotificationsContext';
import { notifyAuthChanged } from '@hooks/useAuth';
import logoDark from '@assets/images/logo_nav.webp';

const Topbar: React.FC<{
  topbarHeight: number;
  showNavToggle?: boolean;
  onOpenSidebar?: () => void;
}> = ({ topbarHeight, showNavToggle = false, onOpenSidebar }) => {
  const { name } = useUser();
  const { preference, resolvedMode, setPreference } = useThemeContext();
  const { unreadCount, togglePanel } = useNotifications();
  const navigate = useNavigate();
  const isCompact = useMediaQuery('(max-width:600px)');

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(userMenuAnchor);

  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const themeMenuOpen = Boolean(themeMenuAnchor);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => setUserMenuAnchor(null);

  const handleOpenThemeMenu = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleCloseThemeMenu = () => setThemeMenuAnchor(null);

  const handleSelectTheme = (mode: ThemeModePreference) => {
    setPreference(mode);
    handleCloseThemeMenu();
  };

  const handleGoToUserSettings = () => {
    handleCloseUserMenu();
    navigate('/settings/user');
  };

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

  const themeIcon =
    preference === 'system' ? (
      <SettingsBrightnessIcon sx={{ fontSize: '1.25rem' }} />
    ) : resolvedMode === 'dark' ? (
      <DarkModeIcon sx={{ fontSize: '1.25rem' }} />
    ) : (
      <LightModeIcon sx={{ fontSize: '1.25rem' }} />
    );

  const themeLabel =
    preference === 'system'
      ? `Theme: System (${resolvedMode === 'dark' ? 'Dark' : 'Light'})`
      : `Theme: ${resolvedMode === 'dark' ? 'Dark' : 'Light'}`;

  return (
    <AppBar
      position="relative"
      elevation={0}
      color="default"
      sx={{
        backgroundColor: 'transparent',
        width: '100%',
        height: topbarHeight,
        borderRadius: 0,
        p: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          py: 0.5,
          minHeight: `${topbarHeight}px !important`,
        }}
      >
        {/* Left: Nav toggle + Logo and Company Name */}
        <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
          {showNavToggle && (
            <Tooltip title="Open navigation">
              <IconButton
                size="small"
                aria-label="Open navigation"
                onClick={onOpenSidebar}
                edge="start"
              >
                <MenuIcon sx={{ fontSize: '1.25rem' }} />
              </IconButton>
            </Tooltip>
          )}

          <img src={logoDark} alt="Coreport Logo" style={{ height: '40px', width: 'auto' }} />
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: 'none', sm: 'block' },
              height: '24px',
              my: 'auto',
              borderColor: 'text.primary',
            }}
          />
          <Typography
            variant="h6"
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 600,
              color: 'text.primary',
              fontFamily: 'Righteous, cursive',
            }}
          >
            CO<span style={{ color: '#4fb0c1' }}>RE</span>PORT
          </Typography>
        </Box>

        {/* Middle: Search Bar */}
        <Box sx={{ flex: 1, maxWidth: { xs: 'none', sm: 400 }, mx: { xs: 1, sm: 4 }, minWidth: 0 }}>
          <TextField
            fullWidth
            placeholder={isCompact ? 'Search' : 'Search...'}
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
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.08),
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.12),
                },
                '& fieldset': {
                  borderColor: (theme) => alpha(theme.palette.common.white, 0.22),
                },
              },
            }}
          />
        </Box>

        {/* Right: Icon buttons */}
        <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
          <Tooltip title={themeLabel}>
            <IconButton size="small" aria-label="Theme mode" onClick={handleOpenThemeMenu}>
              {themeIcon}
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={themeMenuAnchor}
            open={themeMenuOpen}
            onClose={handleCloseThemeMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => handleSelectTheme('light')}>
              <ListItemIcon>{preference === 'light' ? <CheckIcon fontSize="small" /> : <span />}</ListItemIcon>
              <ListItemText primary="Light" />
            </MenuItem>
            <MenuItem onClick={() => handleSelectTheme('dark')}>
              <ListItemIcon>{preference === 'dark' ? <CheckIcon fontSize="small" /> : <span />}</ListItemIcon>
              <ListItemText primary="Dark" />
            </MenuItem>
            <MenuItem onClick={() => handleSelectTheme('system')}>
              <ListItemIcon>{preference === 'system' ? <CheckIcon fontSize="small" /> : <span />}</ListItemIcon>
              <ListItemText primary="System" secondary={`Currently ${resolvedMode}`} />
            </MenuItem>
          </Menu>

          <Tooltip title="Notifications">
            <IconButton size="small" edge="end" aria-label="Notifications" onClick={togglePanel}>
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
            <MenuItem onClick={handleGoToUserSettings} data-testid="user-settings-menu-item">
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              User Settings
            </MenuItem>
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
