import CSVManager from './csvManager';

export interface LiveActivity {
  id: string;
  userId: string;
  username: string;
  action: string;
  timestamp: Date;
  deviceInfo: DeviceInfo;
  locationInfo: LocationInfo;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  isActive: boolean;
}

export interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  screenResolution: string;
  timezone: string;
  language: string;
}

export interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
}

export interface TrackingConfig {
  enableLocationTracking: boolean;
  enableDeviceTracking: boolean;
  enableActivityMonitoring: boolean;
  updateInterval: number; // milliseconds
  maxSessionDuration: number; // minutes
}

class LiveTracker {
  private static instance: LiveTracker;
  private activities: LiveActivity[] = [];
  private activeSessions: Map<string, LiveActivity> = new Map();
  private trackingInterval: NodeJS.Timeout | null = null;
  private csvManager: CSVManager;
  private config: TrackingConfig = {
    enableLocationTracking: true,
    enableDeviceTracking: true,
    enableActivityMonitoring: true,
    updateInterval: 30000, // 30 seconds
    maxSessionDuration: 480 // 8 hours
  };

  private constructor() {
    this.csvManager = CSVManager.getInstance();
    this.initializeTracking();
  }

  public static getInstance(): LiveTracker {
    if (!LiveTracker.instance) {
      LiveTracker.instance = new LiveTracker();
    }
    return LiveTracker.instance;
  }

  private async initializeTracking(): Promise<void> {
    if (this.config.enableActivityMonitoring) {
      this.startActivityMonitoring();
    }
    
    if (this.config.enableLocationTracking) {
      await this.requestLocationPermission();
    }

    this.startPeriodicUpdates();
  }

  private startActivityMonitoring(): void {
    // Monitor user interactions
    document.addEventListener('click', this.handleUserInteraction.bind(this));
    document.addEventListener('keydown', this.handleUserInteraction.bind(this));
    document.addEventListener('scroll', this.handleUserInteraction.bind(this));
    
    // Monitor page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Monitor network status
    window.addEventListener('online', this.handleNetworkChange.bind(this));
    window.addEventListener('offline', this.handleNetworkChange.bind(this));
  }

  private handleUserInteraction(event: Event): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const activity: LiveActivity = {
      id: this.generateId(),
      userId: currentUser.id,
      username: currentUser.username,
      action: this.getActionFromEvent(event),
      timestamp: new Date(),
      deviceInfo: this.getDeviceInfo(),
      locationInfo: this.getLocationInfo(),
      riskLevel: this.calculateRiskLevel(event),
      ipAddress: this.getIPAddress(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
      isActive: true
    };

    this.recordActivity(activity);
  }

  private handleVisibilityChange(): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const action = document.hidden ? 'Page Hidden' : 'Page Visible';
    const activity: LiveActivity = {
      id: this.generateId(),
      userId: currentUser.id,
      username: currentUser.username,
      action,
      timestamp: new Date(),
      deviceInfo: this.getDeviceInfo(),
      locationInfo: this.getLocationInfo(),
      riskLevel: 'low',
      ipAddress: this.getIPAddress(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
      isActive: !document.hidden
    };

    this.recordActivity(activity);
  }

  private handleNetworkChange(event: Event): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const action = event.type === 'online' ? 'Network Connected' : 'Network Disconnected';
    const activity: LiveActivity = {
      id: this.generateId(),
      userId: currentUser.id,
      username: currentUser.username,
      action,
      timestamp: new Date(),
      deviceInfo: this.getDeviceInfo(),
      locationInfo: this.getLocationInfo(),
      riskLevel: event.type === 'offline' ? 'high' : 'low',
      ipAddress: this.getIPAddress(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
      isActive: navigator.onLine
    };

    this.recordActivity(activity);
  }

  private getActionFromEvent(event: Event): string {
    if (event.type === 'click') {
      const target = event.target as HTMLElement;
      return `Clicked: ${target.tagName.toLowerCase()}${target.className ? ` (${target.className})` : ''}`;
    } else if (event.type === 'keydown') {
      const keyboardEvent = event as KeyboardEvent;
      return `Key Pressed: ${keyboardEvent.key}`;
    } else if (event.type === 'scroll') {
      return 'Page Scrolled';
    }
    return 'User Interaction';
  }

  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const screen = window.screen;

    return {
      deviceType: this.getDeviceType(),
      os: this.getOperatingSystem(userAgent),
      browser: this.getBrowser(userAgent),
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    } else if (/mobile|android|iphone|ipod|blackberry|opera mini/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getOperatingSystem(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private async getLocationInfo(): Promise<LocationInfo> {
    if (!this.config.enableLocationTracking) {
      return {};
    }

    try {
      // Try to get precise location if permission granted
      if (navigator.geolocation) {
        const position = await this.getCurrentPosition();
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      }
    } catch (error) {
      console.log('Location tracking not available:', error);
    }

    // Fallback to IP-based location (would need external service)
    return {};
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      });
    });
  }

  private async requestLocationPermission(): Promise<void> {
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        console.log('Location permission status:', permission.state);
      } catch (error) {
        console.log('Permission API not supported');
      }
    }
  }

  private calculateRiskLevel(event: Event): 'low' | 'medium' | 'high' | 'critical' {
    // Implement risk assessment logic
    const currentUser = this.getCurrentUser();
    if (!currentUser) return 'low';

    // Check for suspicious patterns
    const recentActivities = this.getRecentActivities(currentUser.id, 5); // Last 5 minutes
    const suspiciousCount = recentActivities.filter(activity => 
      activity.action.includes('logout') || 
      activity.action.includes('failed') ||
      activity.riskLevel === 'high'
    ).length;

    if (suspiciousCount > 3) return 'critical';
    if (suspiciousCount > 1) return 'high';
    if (suspiciousCount > 0) return 'medium';
    
    return 'low';
  }

  private getIPAddress(): string {
    // In a real implementation, you'd get this from your backend
    // For now, we'll use a placeholder
    return '192.168.1.100';
  }

  private getSessionId(): string {
            let sessionId = sessionStorage.getItem('havenx_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
              sessionStorage.setItem('havenx_session_id', sessionId);
    }
    return sessionId;
  }

  private getCurrentUser(): any {
    // Get current user from localStorage or context
            const userData = localStorage.getItem('havenx_user');
    return userData ? JSON.parse(userData) : null;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private recordActivity(activity: LiveActivity): void {
    this.activities.push(activity);
    this.activeSessions.set(activity.sessionId, activity);
    
    // Store in localStorage for persistence
    this.saveActivities();
    
    // Emit event for real-time updates
    this.emitActivityUpdate(activity);
  }

  private saveActivities(): void {
    localStorage.setItem('havenx_live_activities', JSON.stringify(this.activities));
  }

  private loadActivities(): void {
    const stored = localStorage.getItem('havenx_live_activities');
    if (stored) {
      this.activities = JSON.parse(stored).map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
    }
  }

  private startPeriodicUpdates(): void {
    this.trackingInterval = setInterval(() => {
      this.updateActiveSessions();
      this.cleanupOldActivities();
    }, this.config.updateInterval);
  }

  private updateActiveSessions(): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const sessionId = this.getSessionId();
    const existingSession = this.activeSessions.get(sessionId);
    
    if (existingSession) {
      existingSession.timestamp = new Date();
      existingSession.isActive = true;
    }
  }

  private cleanupOldActivities(): void {
    const cutoffTime = new Date(Date.now() - (this.config.maxSessionDuration * 60 * 1000));
    this.activities = this.activities.filter(activity => 
      activity.timestamp > cutoffTime
    );
    this.saveActivities();
  }

  private emitActivityUpdate(activity: LiveActivity): void {
    // Create custom event for real-time updates
    const event = new CustomEvent('havenx-activity-update', {
      detail: activity
    });
    window.dispatchEvent(event);
  }

  // Public API methods
  public getRecentActivities(userId?: string, minutes: number = 60): LiveActivity[] {
    const cutoffTime = new Date(Date.now() - (minutes * 60 * 1000));
    let filtered = this.activities.filter(activity => 
      activity.timestamp > cutoffTime
    );
    
    if (userId) {
      filtered = filtered.filter(activity => activity.userId === userId);
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getActiveSessions(): LiveActivity[] {
    return Array.from(this.activeSessions.values());
  }

  public getActivityStats(): any {
    const recent = this.getRecentActivities();
    const active = this.getActiveSessions();
    
    return {
      totalActivities: this.activities.length,
      recentActivities: recent.length,
      activeSessions: active.length,
      riskDistribution: this.getRiskDistribution(recent),
      deviceDistribution: this.getDeviceDistribution(recent)
    };
  }

  private getRiskDistribution(activities: LiveActivity[]): any {
    const distribution = { low: 0, medium: 0, high: 0, critical: 0 };
    activities.forEach(activity => {
      distribution[activity.riskLevel]++;
    });
    return distribution;
  }

  private getDeviceDistribution(activities: LiveActivity[]): any {
    const distribution = { desktop: 0, mobile: 0, tablet: 0 };
    activities.forEach(activity => {
      distribution[activity.deviceInfo.deviceType]++;
    });
    return distribution;
  }

  public updateConfig(newConfig: Partial<TrackingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('havenx_tracking_config', JSON.stringify(this.config));
  }

  public stopTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }

  public startTracking(): void {
    this.initializeTracking();
  }
}

export default LiveTracker; 