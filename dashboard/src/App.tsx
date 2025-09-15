import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useDashboardStore } from '@/store';
import { webSocketService } from '@/services/websocket';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Groups from '@/pages/Groups';
import HostDetail from '@/pages/HostDetail';
import Notifications from '@/pages/Notifications';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Create theme
const createAppTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const { theme, setUser, setAuthenticated, setHosts, setHostGroups } = useDashboardStore();

  useEffect(() => {
    // Initialize app
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check authentication
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Mock user data - in real app, this would come from API
        const mockUser = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin' as const,
          permissions: ['read', 'write', 'admin'],
          preferences: {
            theme: 'light' as const,
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h' as const,
            defaultTimeRange: '7d',
            notifications: {
              email: true,
              browser: true,
              alerts: true,
            },
          },
        };
        
        setUser(mockUser);
        setAuthenticated(true);

        // Connect WebSocket
        webSocketService.connect(token);

        // Load initial data
        await loadInitialData();
      } else {
        // Redirect to login in real app
        console.log('No auth token found');
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  const loadInitialData = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockHosts = [
        {
          id: '1',
          name: 'Workstation-01',
          hostname: 'workstation-01.local',
          platform: 'windows' as const,
          lastSeen: new Date().toISOString(),
          isOnline: true,
          version: '0.12.0',
          timezone: 'UTC',
          metadata: {
            activeTime: 8 * 3600,
            productivityScore: 85,
          },
        },
        {
          id: '2',
          name: 'Laptop-Dev',
          hostname: 'laptop-dev.local',
          platform: 'macos' as const,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isOnline: false,
          version: '0.12.0',
          timezone: 'UTC',
          metadata: {
            activeTime: 6 * 3600,
            productivityScore: 72,
          },
        },
        {
          id: '3',
          name: 'Server-Prod',
          hostname: 'server-prod.local',
          platform: 'linux' as const,
          lastSeen: new Date().toISOString(),
          isOnline: true,
          version: '0.12.0',
          timezone: 'UTC',
          metadata: {
            activeTime: 24 * 3600,
            productivityScore: 95,
          },
        },
      ];

      const mockGroups = [
        {
          id: '1',
          name: 'Development Team',
          description: 'Development workstations and laptops',
          color: '#1976d2',
          hosts: ['1', '2'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            workingHours: {
              start: '09:00',
              end: '17:00',
              timezone: 'UTC',
              workdays: [1, 2, 3, 4, 5],
            },
            productivityCategories: {
              productive: ['code', 'design', 'meeting'],
              neutral: ['email', 'documentation'],
              distracting: ['social', 'entertainment'],
            },
            alerts: {
              overtime: true,
              downtime: true,
              lowActivity: true,
            },
          },
        },
        {
          id: '2',
          name: 'Production Servers',
          description: 'Production server infrastructure',
          color: '#388e3c',
          hosts: ['3'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            workingHours: {
              start: '00:00',
              end: '23:59',
              timezone: 'UTC',
              workdays: [0, 1, 2, 3, 4, 5, 6],
            },
            productivityCategories: {
              productive: ['monitoring', 'maintenance', 'deployment'],
              neutral: ['logging', 'backup'],
              distracting: [],
            },
            alerts: {
              overtime: false,
              downtime: true,
              lowActivity: false,
            },
          },
        },
      ];

      setHosts(mockHosts);
      setHostGroups(mockGroups);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const appTheme = createAppTheme(theme);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="groups" element={<Groups />} />
              <Route path="groups/:groupId" element={<Groups />} />
              <Route path="hosts/:hostId" element={<HostDetail />} />
              <Route path="analytics" element={<div>Analytics Page</div>} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<div>Settings Page</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: appTheme.palette.background.paper,
              color: appTheme.palette.text.primary,
              border: `1px solid ${appTheme.palette.divider}`,
            },
          }}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
