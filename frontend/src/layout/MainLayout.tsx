import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, ThemeProvider } from '@mui/material';
import Sidebar from '@layout/Sidebar';
import Topbar from '@layout/Topbar';
import Content from '@layout/Content';
import { darkTheme } from '@theme/theme';

const TOPBAR_HEIGHT = 50;
const SIDEBAR_WIDTH = 240;

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        background: 'radial-gradient(ellipse at top left, #2F394A 0%, #1F2733 30%, #020509 100%)',
      }}
    >
      {/* Dark theme for Topbar */}
      <ThemeProvider theme={darkTheme}>
        <Topbar topbarHeight={TOPBAR_HEIGHT} />
      </ThemeProvider>
      <Box
        display="flex"
        minHeight={`calc(100vh - ${TOPBAR_HEIGHT}px)`}
      >
        {/* Dark theme for Sidebar */}
        <ThemeProvider theme={darkTheme}>
          <Sidebar sidebarWidth={SIDEBAR_WIDTH} />
        </ThemeProvider>
        {/* Content uses the main theme from ThemeContext */}
        <Content topbarHeight={TOPBAR_HEIGHT}>
          {children ?? <Outlet />}
        </Content>
      </Box>
    </Box>
  );
};

export default MainLayout;
