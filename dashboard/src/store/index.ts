import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Host, HostGroup, User, UserPreferences, Alert, DashboardWidget } from '@/types';

interface DashboardState {
  // User & Authentication
  user: User | null;
  isAuthenticated: boolean;
  
  // Hosts & Groups
  hosts: Host[];
  hostGroups: HostGroup[];
  selectedGroupId: string | null;
  selectedHostId: string | null;
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
  
  // Alerts & Notifications
  alerts: Alert[];
  unreadAlerts: number;
  
  // Dashboard Customization
  widgets: DashboardWidget[];
  layout: 'grid' | 'list';
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setHosts: (hosts: Host[]) => void;
  addHost: (host: Host) => void;
  updateHost: (hostId: string, updates: Partial<Host>) => void;
  removeHost: (hostId: string) => void;
  setHostGroups: (groups: HostGroup[]) => void;
  addHostGroup: (group: HostGroup) => void;
  updateHostGroup: (groupId: string, updates: Partial<HostGroup>) => void;
  removeHostGroup: (groupId: string) => void;
  setSelectedGroup: (groupId: string | null) => void;
  setSelectedHost: (hostId: string | null) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (alertId: string, updates: Partial<Alert>) => void;
  removeAlert: (alertId: string) => void;
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: () => void;
  setWidgets: (widgets: DashboardWidget[]) => void;
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  setLayout: (layout: 'grid' | 'list') => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        hosts: [],
        hostGroups: [],
        selectedGroupId: null,
        selectedHostId: null,
        sidebarOpen: true,
        theme: 'light',
        loading: false,
        error: null,
        alerts: [],
        unreadAlerts: 0,
        widgets: [],
        layout: 'grid',

        // Actions
        setUser: (user) => set({ user }),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        
        setHosts: (hosts) => set({ hosts }),
        addHost: (host) => set((state) => ({ hosts: [...state.hosts, host] })),
        updateHost: (hostId, updates) => set((state) => ({
          hosts: state.hosts.map(host => 
            host.id === hostId ? { ...host, ...updates } : host
          )
        })),
        removeHost: (hostId) => set((state) => ({
          hosts: state.hosts.filter(host => host.id !== hostId)
        })),

        setHostGroups: (hostGroups) => set({ hostGroups }),
        addHostGroup: (group) => set((state) => ({ 
          hostGroups: [...state.hostGroups, group] 
        })),
        updateHostGroup: (groupId, updates) => set((state) => ({
          hostGroups: state.hostGroups.map(group => 
            group.id === groupId ? { ...group, ...updates } : group
          )
        })),
        removeHostGroup: (groupId) => set((state) => ({
          hostGroups: state.hostGroups.filter(group => group.id !== groupId)
        })),
        
        setSelectedGroup: (selectedGroupId) => set({ selectedGroupId }),
        setSelectedHost: (selectedHostId) => set({ selectedHostId }),
        
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        
        addAlert: (alert) => set((state) => ({
          alerts: [alert, ...state.alerts],
          unreadAlerts: state.unreadAlerts + 1
        })),
        updateAlert: (alertId, updates) => set((state) => ({
          alerts: state.alerts.map(alert => 
            alert.id === alertId ? { ...alert, ...updates } : alert
          )
        })),
        removeAlert: (alertId) => set((state) => ({
          alerts: state.alerts.filter(alert => alert.id !== alertId)
        })),
        markAlertAsRead: (alertId) => set((state) => ({
          alerts: state.alerts.map(alert => 
            alert.id === alertId ? { ...alert, isRead: true } : alert
          ),
          unreadAlerts: Math.max(0, state.unreadAlerts - 1)
        })),
        markAllAlertsAsRead: () => set((state) => ({
          alerts: state.alerts.map(alert => ({ ...alert, isRead: true })),
          unreadAlerts: 0
        })),
        
        setWidgets: (widgets) => set({ widgets }),
        updateWidget: (widgetId, updates) => set((state) => ({
          widgets: state.widgets.map(widget => 
            widget.id === widgetId ? { ...widget, ...updates } : widget
          )
        })),
        setLayout: (layout) => set({ layout }),
        
        updateUserPreferences: (preferences) => set((state) => ({
          user: state.user ? { ...state.user, preferences: { ...state.user.preferences, ...preferences } } : null
        })),
      }),
      {
        name: 'activitywatch-dashboard-storage',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          layout: state.layout,
          widgets: state.widgets,
          user: state.user,
        }),
      }
    ),
    {
      name: 'activitywatch-dashboard',
    }
  )
);
