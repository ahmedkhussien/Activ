import React from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useDashboardStore } from '@/store';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { ErrorBoundary } from '../common/ErrorBoundary';

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, setSelectedGroup, setSelectedHost } = useDashboardStore();

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (isMobile) {
      useDashboardStore.getState().toggleSidebar();
    }
  }, [isMobile]);

  // Clear selections when navigating
  React.useEffect(() => {
    setSelectedGroup(null);
    setSelectedHost(null);
  }, [setSelectedGroup, setSelectedHost]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* Top Bar */}
      <TopBar />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: isMobile ? 0 : sidebarOpen ? '280px' : '64px',
          width: isMobile ? '100%' : sidebarOpen ? 'calc(100% - 280px)' : 'calc(100% - 64px)',
        }}
      >
        <ErrorBoundary>
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Outlet />
          </Box>
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default AppLayout;
