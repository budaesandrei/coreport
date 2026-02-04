import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import Icon from '@mui/material/Icon';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { menuItems } from '@constants/menuItems';
import { useUser } from '@context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  sidebarWidth: number;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

const Sidebar: React.FC<Props> = ({ sidebarWidth, collapsed, onToggleCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, allowedPaths } = useUser();
  const [selectedPath, setSelectedPath] = useState(location.pathname);

  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    setSelectedPath(path);
    navigate(path);
  };

  const visibleSections = useMemo(
    () => menuItems.filter((s) => !(s.role && s.role !== role)),
    [role]
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          position: 'relative',
          height: '100%',
          backgroundColor: 'transparent',
          pl: 0,
          overflowX: 'hidden',
          transition: (theme) =>
            theme.transitions.create('width', {
              duration: 220,
              easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)', // fast -> slow
            }),
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          display="flex"
          alignItems="center"
          justifyContent={collapsed ? 'center' : 'flex-end'}
          px={collapsed ? 0 : 1}
          pt={1}
          pb={0.5}
        >
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <IconButton size="small" onClick={onToggleCollapsed} aria-label="Toggle sidebar">
              {collapsed ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <List sx={{ px: collapsed ? 0.5 : 0 }}>
          {visibleSections.map((section) => (
            <React.Fragment key={section.label}>
              {/* Section label */}
              {!collapsed && (
                <Divider textAlign="left" sx={{ pt: 1.5, pb: 0.5 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {section.label}
                  </Typography>
                </Divider>
              )}

              {/* Section items */}
              {section.children.map((item) => {
                if (!allowedPaths.includes(item.path)) return null;

                const button = (
                  <ListItemButton
                    dense
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    selected={selectedPath === item.path}
                    aria-label={item.label}
                    sx={{
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      px: collapsed ? 1 : 2,
                      // Ensure visible focus ring, especially in collapsed (icon-only) mode
                      '&.Mui-focusVisible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {item.icon && (
                      <ListItemIcon
                        sx={{
                          minWidth: collapsed ? 0 : '40px',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon fontSize="small">{item.icon}</Icon>
                      </ListItemIcon>
                    )}
                    {!collapsed && <ListItemText primary={item.label} />}
                  </ListItemButton>
                );

                return collapsed ? (
                  <Tooltip key={item.label} title={item.label} placement="right">
                    {button}
                  </Tooltip>
                ) : (
                  button
                );
              })}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
