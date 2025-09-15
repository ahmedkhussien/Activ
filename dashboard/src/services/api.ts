import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Host, 
  HostGroup, 
  HostMetrics, 
  GroupAnalytics, 
  ActivityEvent, 
  Alert,
  ApiResponse,
  PaginatedResponse,
  TimeRange
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Host Management
  async getHosts(): Promise<Host[]> {
    const response: AxiosResponse<ApiResponse<Host[]>> = await this.api.get('/hosts');
    return response.data.data;
  }

  async getHost(hostId: string): Promise<Host> {
    const response: AxiosResponse<ApiResponse<Host>> = await this.api.get(`/hosts/${hostId}`);
    return response.data.data;
  }

  async updateHost(hostId: string, updates: Partial<Host>): Promise<Host> {
    const response: AxiosResponse<ApiResponse<Host>> = await this.api.patch(`/hosts/${hostId}`, updates);
    return response.data.data;
  }

  async deleteHost(hostId: string): Promise<void> {
    await this.api.delete(`/hosts/${hostId}`);
  }

  // Host Group Management
  async getHostGroups(): Promise<HostGroup[]> {
    const response: AxiosResponse<ApiResponse<HostGroup[]>> = await this.api.get('/groups');
    return response.data.data;
  }

  async getHostGroup(groupId: string): Promise<HostGroup> {
    const response: AxiosResponse<ApiResponse<HostGroup>> = await this.api.get(`/groups/${groupId}`);
    return response.data.data;
  }

  async createHostGroup(group: Omit<HostGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<HostGroup> {
    const response: AxiosResponse<ApiResponse<HostGroup>> = await this.api.post('/groups', group);
    return response.data.data;
  }

  async updateHostGroup(groupId: string, updates: Partial<HostGroup>): Promise<HostGroup> {
    const response: AxiosResponse<ApiResponse<HostGroup>> = await this.api.patch(`/groups/${groupId}`, updates);
    return response.data.data;
  }

  async deleteHostGroup(groupId: string): Promise<void> {
    await this.api.delete(`/groups/${groupId}`);
  }

  async addHostToGroup(groupId: string, hostId: string): Promise<void> {
    await this.api.post(`/groups/${groupId}/hosts`, { hostId });
  }

  async removeHostFromGroup(groupId: string, hostId: string): Promise<void> {
    await this.api.delete(`/groups/${groupId}/hosts/${hostId}`);
  }

  // Analytics & Metrics
  async getHostMetrics(hostId: string, timeRange: TimeRange): Promise<HostMetrics> {
    const response: AxiosResponse<ApiResponse<HostMetrics>> = await this.api.get(
      `/hosts/${hostId}/metrics`,
      { params: { start: timeRange.start, end: timeRange.end } }
    );
    return response.data.data;
  }

  async getGroupAnalytics(groupId: string, timeRange: TimeRange): Promise<GroupAnalytics> {
    const response: AxiosResponse<ApiResponse<GroupAnalytics>> = await this.api.get(
      `/groups/${groupId}/analytics`,
      { params: { start: timeRange.start, end: timeRange.end } }
    );
    return response.data.data;
  }

  async getActivityEvents(
    hostId?: string, 
    groupId?: string, 
    timeRange?: TimeRange,
    page = 1,
    limit = 100
  ): Promise<PaginatedResponse<ActivityEvent>> {
    const params: any = { page, limit };
    if (hostId) params.hostId = hostId;
    if (groupId) params.groupId = groupId;
    if (timeRange) {
      params.start = timeRange.start;
      params.end = timeRange.end;
    }

    const response: AxiosResponse<PaginatedResponse<ActivityEvent>> = await this.api.get(
      '/activity/events',
      { params }
    );
    return response.data;
  }

  // Alerts
  async getAlerts(page = 1, limit = 50): Promise<PaginatedResponse<Alert>> {
    const response: AxiosResponse<PaginatedResponse<Alert>> = await this.api.get(
      '/alerts',
      { params: { page, limit } }
    );
    return response.data;
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    await this.api.patch(`/alerts/${alertId}/read`);
  }

  async markAllAlertsAsRead(): Promise<void> {
    await this.api.patch('/alerts/read-all');
  }

  async resolveAlert(alertId: string): Promise<void> {
    await this.api.patch(`/alerts/${alertId}/resolve`);
  }

  // Real-time Data
  async getRealtimeMetrics(hostId?: string, groupId?: string): Promise<any> {
    const params: any = {};
    if (hostId) params.hostId = hostId;
    if (groupId) params.groupId = groupId;

    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(
      '/realtime/metrics',
      { params }
    );
    return response.data.data;
  }

  // Export Data
  async exportData(
    type: 'csv' | 'excel' | 'pdf',
    hostId?: string,
    groupId?: string,
    timeRange?: TimeRange
  ): Promise<Blob> {
    const params: any = { type };
    if (hostId) params.hostId = hostId;
    if (groupId) params.groupId = groupId;
    if (timeRange) {
      params.start = timeRange.start;
      params.end = timeRange.end;
    }

    const response = await this.api.get('/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response: AxiosResponse<ApiResponse<{ status: string; timestamp: string }>> = 
      await this.api.get('/health');
    return response.data.data;
  }
}

export const apiService = new ApiService();
export default apiService;
