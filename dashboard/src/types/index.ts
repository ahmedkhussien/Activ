// ActivityWatch Data Types
export interface Host {
  id: string;
  name: string;
  hostname: string;
  platform: 'windows' | 'macos' | 'linux';
  lastSeen: string;
  isOnline: boolean;
  version: string;
  timezone: string;
  groupId?: string;
  metadata?: Record<string, any>;
}

export interface HostGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  hosts: string[];
  createdAt: string;
  updatedAt: string;
  settings: GroupSettings;
}

export interface GroupSettings {
  workingHours: {
    start: string; // HH:mm format
    end: string;   // HH:mm format
    timezone: string;
    workdays: number[]; // 0-6 (Sunday-Saturday)
  };
  productivityCategories: {
    productive: string[];
    neutral: string[];
    distracting: string[];
  };
  alerts: {
    overtime: boolean;
    downtime: boolean;
    lowActivity: boolean;
  };
}

export interface ActivityEvent {
  id: string;
  hostId: string;
  timestamp: string;
  duration: number; // seconds
  type: 'app' | 'web' | 'afk' | 'input';
  data: {
    app?: string;
    title?: string;
    url?: string;
    category?: 'productive' | 'neutral' | 'distracting';
    isActive?: boolean;
  };
}

export interface TimeRange {
  start: string;
  end: string;
  label: string;
}

export interface ProductivityMetrics {
  totalTime: number;
  activeTime: number;
  idleTime: number;
  productiveTime: number;
  neutralTime: number;
  distractingTime: number;
  afkTime: number;
  workingHours: number;
  overtime: number;
  productivityScore: number; // 0-100
}

export interface HostMetrics extends ProductivityMetrics {
  hostId: string;
  period: string;
  applications: ApplicationUsage[];
  websites: WebsiteUsage[];
  activityHeatmap: ActivityHeatmapData[];
  peakHours: number[];
  downtimeEvents: DowntimeEvent[];
}

export interface ApplicationUsage {
  name: string;
  time: number;
  category: 'productive' | 'neutral' | 'distracting';
  sessions: number;
  avgSessionDuration: number;
}

export interface WebsiteUsage {
  domain: string;
  url: string;
  time: number;
  category: 'productive' | 'neutral' | 'distracting';
  visits: number;
  avgVisitDuration: number;
}

export interface ActivityHeatmapData {
  hour: number;
  day: number; // 0-6 (Sunday-Saturday)
  intensity: number; // 0-1
  activity: number; // seconds
}

export interface DowntimeEvent {
  id: string;
  hostId: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: 'scheduled' | 'unscheduled' | 'maintenance';
  reason?: string;
}

export interface GroupAnalytics {
  groupId: string;
  period: string;
  totalHosts: number;
  onlineHosts: number;
  metrics: ProductivityMetrics;
  hostMetrics: HostMetrics[];
  trends: {
    productivity: TrendData[];
    activity: TrendData[];
    downtime: TrendData[];
  };
  topApplications: ApplicationUsage[];
  topWebsites: WebsiteUsage[];
  alerts: Alert[];
}

export interface TrendData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface Alert {
  id: string;
  type: 'overtime' | 'downtime' | 'low_activity' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  hostId?: string;
  groupId?: string;
  timestamp: string;
  isRead: boolean;
  isResolved: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'list' | 'gauge';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  data?: any;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'heatmap' | 'gauge' | 'stacked_area';
  title: string;
  data: any;
  options?: any;
  timeRange?: TimeRange;
  refreshInterval?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  permissions: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  defaultTimeRange: string;
  notifications: {
    email: boolean;
    browser: boolean;
    alerts: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: 'host_status' | 'activity_update' | 'alert' | 'metrics_update';
  data: any;
  timestamp: string;
}

export interface HostStatusEvent {
  hostId: string;
  isOnline: boolean;
  lastActivity: string;
  currentApp?: string;
}

export interface ActivityUpdateEvent {
  hostId: string;
  activity: ActivityEvent;
}

export interface MetricsUpdateEvent {
  hostId?: string;
  groupId?: string;
  metrics: HostMetrics | GroupAnalytics;
}
