import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import Icon from '@mui/material/Icon';

import { menuItems } from '@constants/menuItems';
import { useUser } from '@context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC<{ sidebarWidth: number }> = ({ sidebarWidth }) => {
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
          pl: 0
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <List>
          {menuItems.map((section) =>
            section.role && section.role !== role ? null : (
              <React.Fragment key={section.label}>
                {/* Section label */}
                <Divider textAlign="left" sx={{ pt: 1.5, pb: 0.5 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    {section.label}
                  </Typography>
                </Divider>

                {/* Section items */}
                {section.children.map((item) =>
                  allowedPaths.includes(item.path) ? (
                    <ListItemButton
                      dense
                      key={item.label}
                      onClick={() => handleNavigation(item.path)}
                      selected={selectedPath === item.path}
                      sx={{
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                      }}
                    >
                      {item.icon && (
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                          <Icon fontSize="small">{item.icon}</Icon>
                        </ListItemIcon>
                      )}
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ) : null
                )}

              </React.Fragment>
            )
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
