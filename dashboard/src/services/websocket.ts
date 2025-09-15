import { io, Socket } from 'socket.io-client';
import { WebSocketEvent, HostStatusEvent, ActivityUpdateEvent, MetricsUpdateEvent } from '@/types';
import { useDashboardStore } from '@/store';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token?: string): void {
    if (this.socket?.connected) {
      return;
    }

    const url = process.env.NODE_ENV === 'production' 
      ? window.location.origin.replace('http', 'ws')
      : 'ws://localhost:5600';

    this.socket = io(url, {
      auth: {
        token: token || localStorage.getItem('auth_token'),
      },
      transports: ['websocket'],
      timeout: 20000,
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      useDashboardStore.getState().setError(null);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      useDashboardStore.getState().setError('Connection failed. Retrying...');
      this.handleReconnect();
    });

    // Host status updates
    this.socket.on('host_status', (data: HostStatusEvent) => {
      const { updateHost } = useDashboardStore.getState();
      updateHost(data.hostId, {
        isOnline: data.isOnline,
        lastSeen: data.lastActivity,
      });
    });

    // Activity updates
    this.socket.on('activity_update', (data: ActivityUpdateEvent) => {
      // Handle real-time activity updates
      console.log('Activity update:', data);
    });

    // Metrics updates
    this.socket.on('metrics_update', (data: MetricsUpdateEvent) => {
      // Handle real-time metrics updates
      console.log('Metrics update:', data);
    });

    // Alert notifications
    this.socket.on('alert', (alert) => {
      const { addAlert } = useDashboardStore.getState();
      addAlert(alert);
    });

    // Generic event handler
    this.socket.on('event', (event: WebSocketEvent) => {
      this.handleEvent(event);
    });
  }

  private handleEvent(event: WebSocketEvent): void {
    switch (event.type) {
      case 'host_status':
        this.handleHostStatusEvent(event.data as HostStatusEvent);
        break;
      case 'activity_update':
        this.handleActivityUpdateEvent(event.data as ActivityUpdateEvent);
        break;
      case 'alert':
        this.handleAlertEvent(event.data);
        break;
      case 'metrics_update':
        this.handleMetricsUpdateEvent(event.data as MetricsUpdateEvent);
        break;
      default:
        console.log('Unknown event type:', event.type);
    }
  }

  private handleHostStatusEvent(data: HostStatusEvent): void {
    const { updateHost } = useDashboardStore.getState();
    updateHost(data.hostId, {
      isOnline: data.isOnline,
      lastSeen: data.lastActivity,
    });
  }

  private handleActivityUpdateEvent(data: ActivityUpdateEvent): void {
    // Update real-time activity data
    console.log('Real-time activity update:', data);
  }

  private handleAlertEvent(alert: any): void {
    const { addAlert } = useDashboardStore.getState();
    addAlert(alert);
  }

  private handleMetricsUpdateEvent(data: MetricsUpdateEvent): void {
    // Update real-time metrics
    console.log('Real-time metrics update:', data);
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      useDashboardStore.getState().setError('Connection lost. Please refresh the page.');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, delay);
  }

  // Subscribe to specific events
  subscribeToHost(hostId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('subscribe_host', hostId);
    }
  }

  subscribeToGroup(groupId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('subscribe_group', groupId);
    }
  }

  unsubscribeFromHost(hostId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe_host', hostId);
    }
  }

  unsubscribeFromGroup(groupId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe_group', groupId);
    }
  }

  // Send custom events
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket instance for advanced usage
  getSocket(): Socket | null {
    return this.socket;
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
