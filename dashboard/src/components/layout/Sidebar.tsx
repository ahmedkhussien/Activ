import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
  Collapse,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  Groups,
  Computer,
  Analytics,
  Notifications,
  Settings,
  ExpandLess,
  ExpandMore,
  Add,
  ChevronLeft,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import { useDashboardStore } from '@/store';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 64;

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    sidebarOpen, 
    toggleSidebar, 
    hostGroups, 
    unreadAlerts,
    selectedGroupId,
    setSelectedGroup 
  } = useDashboardStore();

  const [groupsExpanded, setGroupsExpanded] = React.useState(true);
  const [hostsExpanded, setHostsExpanded] = React.useState(false);

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
      exact: true,
    },
    {
      text: 'Analytics',
      icon: <Analytics />,
      path: '/analytics',
    },
    {
      text: 'Notifications',
      icon: <Notifications />,
      path: '/notifications',
      badge: unreadAlerts > 0 ? unreadAlerts : undefined,
    },
    {
      text: 'Settings',
      icon: <Settings />,
      path: '/settings',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleGroupClick = (groupId: string) => {
    setSelectedGroup(groupId);
    navigate(`/groups/${groupId}`);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleHostClick = (hostId: string) => {
    navigate(`/hosts/${hostId}`);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          minHeight: 64,
        }}
      >
        {sidebarOpen && (
          <Typography variant="h6" noWrap>
            ActivityWatch
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>
          <ChevronLeft />
        </IconButton>
      </Box>

      <Divider />

      {/* Main Navigation */}
      <List sx={{ flex: 1, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path, item.exact)}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Host Groups Section */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setGroupsExpanded(!groupsExpanded)}
            sx={{ mx: 1, borderRadius: 1 }}
          >
            <ListItemIcon>
              <Groups />
            </ListItemIcon>
            {sidebarOpen && (
              <>
                <ListItemText primary="Host Groups" />
                {groupsExpanded ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>
        </ListItem>

        <Collapse in={groupsExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {hostGroups.map((group) => (
              <ListItem key={group.id} disablePadding>
                <ListItemButton
                  onClick={() => handleGroupClick(group.id)}
                  selected={selectedGroupId === group.id}
                  sx={{
                    pl: 4,
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: group.color,
                      mr: 1,
                    }}
                  />
                  {sidebarOpen && (
                    <ListItemText 
                      primary={group.name}
                      secondary={`${group.hosts.length} hosts`}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
            
            {sidebarOpen && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate('/groups/new')}
                  sx={{ pl: 4, mx: 1, borderRadius: 1 }}
                >
                  <ListItemIcon>
                    <Add />
                  </ListItemIcon>
                  <ListItemText primary="Create Group" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Collapse>

        {/* Individual Hosts Section */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setHostsExpanded(!hostsExpanded)}
            sx={{ mx: 1, borderRadius: 1 }}
          >
            <ListItemIcon>
              <Computer />
            </ListItemIcon>
            {sidebarOpen && (
              <>
                <ListItemText primary="All Hosts" />
                {hostsExpanded ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>
        </ListItem>

        <Collapse in={hostsExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {useDashboardStore.getState().hosts.map((host) => (
              <ListItem key={host.id} disablePadding>
                <Tooltip title={host.name} placement="right">
                  <ListItemButton
                    onClick={() => handleHostClick(host.id)}
                    sx={{
                      pl: 4,
                      mx: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: host.isOnline ? '#4caf50' : '#f44336',
                        mr: 1,
                      }}
                    />
                    {sidebarOpen && (
                      <ListItemText 
                        primary={host.name}
                        secondary={host.hostname}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={sidebarOpen}
      onClose={toggleSidebar}
      sx={{
        width: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
