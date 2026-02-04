import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, ThemeProvider } from '@mui/material';
import Sidebar from '@layout/Sidebar';
import Topbar from '@layout/Topbar';
import Content from '@layout/Content';
import { darkTheme } from '@theme/theme';

const TOPBAR_HEIGHT = 50;
const SIDEBAR_WIDTH_EXPANDED = 240;
const SIDEBAR_WIDTH_COLLAPSED = 72;
const SIDEBAR_COLLAPSE_STORAGE_KEY = 'coreport.sidebarCollapsed';

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_COLLAPSE_STORAGE_KEY);
      setSidebarCollapsed(raw === 'true');
    } catch {
      // ignore
    }
  }, []);

  const sidebarWidth = useMemo(
    () => (sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED),
    [sidebarCollapsed]
  );

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSE_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

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
      <Box display="flex" minHeight={`calc(100vh - ${TOPBAR_HEIGHT}px)`}>
        {/* Dark theme for Sidebar */}
        <ThemeProvider theme={darkTheme}>
          <Sidebar
            sidebarWidth={sidebarWidth}
            collapsed={sidebarCollapsed}
            onToggleCollapsed={toggleSidebar}
          />
        </ThemeProvider>
        {/* Content uses the main theme from ThemeContext */}
        <Content topbarHeight={TOPBAR_HEIGHT}>{children ?? <Outlet />}</Content>
      </Box>
    </Box>
  );
};

export default MainLayout;
