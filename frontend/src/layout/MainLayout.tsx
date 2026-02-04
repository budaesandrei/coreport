import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, ThemeProvider, useMediaQuery } from '@mui/material';
import Sidebar from '@layout/Sidebar';
import Topbar from '@layout/Topbar';
import Content from '@layout/Content';
import NotificationsDrawer from '@components/notifications/NotificationsDrawer';
import { darkTheme } from '@theme/theme';

const TOPBAR_HEIGHT = 50;
const SIDEBAR_WIDTH_EXPANDED = 240;
const SIDEBAR_WIDTH_COLLAPSED = 72;
const SIDEBAR_COLLAPSE_STORAGE_KEY = 'coreport.sidebarCollapsed';

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isMobile = useMediaQuery(darkTheme.breakpoints.down('md'));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_COLLAPSE_STORAGE_KEY);
      setSidebarCollapsed(raw === 'true');
    } catch {
      // ignore
    }
  }, []);

  const sidebarWidth = useMemo(() => {
    if (isMobile) return SIDEBAR_WIDTH_EXPANDED;
    return sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
  }, [isMobile, sidebarCollapsed]);

  const toggleSidebar = () => {
    // On mobile, the sidebar is an overlay drawer (no collapsed mode)
    if (isMobile) {
      setMobileSidebarOpen(true);
      return;
    }

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

  useEffect(() => {
    // If we leave mobile layout, ensure the overlay drawer is closed.
    if (!isMobile) setMobileSidebarOpen(false);
  }, [isMobile]);

  return (
    <Box
      sx={{
        background: 'radial-gradient(ellipse at top left, #2F394A 0%, #1F2733 30%, #020509 100%)',
      }}
    >
      {/* Dark theme for Topbar */}
      <ThemeProvider theme={darkTheme}>
        <Topbar
          topbarHeight={TOPBAR_HEIGHT}
          showNavToggle={isMobile}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
        />
        <NotificationsDrawer />
      </ThemeProvider>
      <Box display="flex" minHeight={`calc(100vh - ${TOPBAR_HEIGHT}px)`}>
        {/* Dark theme for Sidebar */}
        <ThemeProvider theme={darkTheme}>
          <Sidebar
            sidebarWidth={sidebarWidth}
            collapsed={isMobile ? false : sidebarCollapsed}
            onToggleCollapsed={toggleSidebar}
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileSidebarOpen : true}
            onClose={() => setMobileSidebarOpen(false)}
            onNavigate={() => setMobileSidebarOpen(false)}
            hideCollapseToggle={isMobile}
          />
        </ThemeProvider>
        {/* Content uses the main theme from ThemeContext */}
        <Content topbarHeight={TOPBAR_HEIGHT} insetRadius={!isMobile}>
          {children ?? <Outlet />}
        </Content>
      </Box>
    </Box>
  );
};

export default MainLayout;
