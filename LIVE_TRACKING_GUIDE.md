# 🚀 Live Tracking Integration Guide for HavenX

## Overview

This guide explains how to integrate real-time tracking capabilities into your HavenX security dashboard. The system includes user activity monitoring, device tracking, location services, and real-time analytics.

## 🏗️ Architecture

### Core Components

1. **LiveTracker** (`src/utils/liveTracker.ts`)
   - Singleton class for managing real-time tracking
   - Handles user activity monitoring
   - Manages device and location data
   - Provides risk assessment

2. **LiveTrackingPanel** (`src/components/LiveTrackingPanel.tsx`)
   - Full-screen tracking dashboard
   - Real-time activity feed
   - Session management
   - Risk alerts

3. **RealTimeMap** (`src/components/RealTimeMap.tsx`)
   - Interactive map showing user locations
   - Heatmap visualization
   - User markers with risk indicators

## 🔧 Implementation Steps

### 1. Basic Setup

The live tracking system is already integrated into your AdminPanel. To enable it:

```typescript
// The LiveTracker is automatically initialized when imported
import LiveTracker from '../utils/liveTracker';

// Get the singleton instance
const tracker = LiveTracker.getInstance();
```

### 2. Enable Location Tracking

```typescript
// Request location permission
await tracker.requestLocationPermission();

// Update tracking configuration
tracker.updateConfig({
  enableLocationTracking: true,
  enableDeviceTracking: true,
  enableActivityMonitoring: true,
  updateInterval: 30000, // 30 seconds
  maxSessionDuration: 480 // 8 hours
});
```

### 3. Monitor User Activities

The system automatically tracks:
- **User interactions** (clicks, key presses, scrolling)
- **Page visibility** changes
- **Network status** changes
- **Device information** (OS, browser, screen resolution)
- **Location data** (if permission granted)

### 4. Real-time Updates

```typescript
// Listen for activity updates
window.addEventListener('havenx-activity-update', (event) => {
  const activity = event.detail;
  console.log('New activity:', activity);
});

// Get recent activities
const recentActivities = tracker.getRecentActivities();
const activeSessions = tracker.getActiveSessions();
const stats = tracker.getActivityStats();
```

## 🗺️ Map Integration

### Option 1: Google Maps (Recommended)

```bash
npm install @googlemaps/js-api-loader
```

```typescript
// In RealTimeMap.tsx
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  version: 'weekly'
});

loader.load().then(() => {
  const map = new google.maps.Map(mapRef.current, {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5,
  });
  
  // Add markers for each user
  activitiesWithLocation.forEach(activity => {
    new google.maps.Marker({
      position: {
        lat: activity.locationInfo.latitude!,
        lng: activity.locationInfo.longitude!
      },
      map: map,
      title: activity.username,
      icon: {
        url: getRiskIcon(activity.riskLevel),
        scaledSize: new google.maps.Size(32, 32)
      }
    });
  });
});
```

### Option 2: Mapbox

```bash
npm install mapbox-gl
```

```typescript
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const map = new mapboxgl.Map({
  container: mapRef.current,
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [78.9629, 20.5937],
  zoom: 5
});
```

### Option 3: Leaflet (Free)

```bash
npm install leaflet react-leaflet
```

```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

<MapContainer center={[20.5937, 78.9629]} zoom={5}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {activitiesWithLocation.map(activity => (
    <Marker
      key={activity.id}
      position={[activity.locationInfo.latitude!, activity.locationInfo.longitude!]}
    >
      <Popup>
        <div>
          <h3>{activity.username}</h3>
          <p>Risk: {activity.riskLevel}</p>
          <p>Device: {activity.deviceInfo.deviceType}</p>
        </div>
      </Popup>
    </Marker>
  ))}
</MapContainer>
```

## 📊 Advanced Features

### 1. Risk Assessment Algorithm

```typescript
// Customize risk assessment in liveTracker.ts
private calculateRiskLevel(event: Event): 'low' | 'medium' | 'high' | 'critical' {
  const currentUser = this.getCurrentUser();
  if (!currentUser) return 'low';

  // Check for suspicious patterns
  const recentActivities = this.getRecentActivities(currentUser.id, 5);
  const suspiciousCount = recentActivities.filter(activity => 
    activity.action.includes('logout') || 
    activity.action.includes('failed') ||
    activity.riskLevel === 'high'
  ).length;

  // Add your custom risk logic here
  if (suspiciousCount > 3) return 'critical';
  if (suspiciousCount > 1) return 'high';
  if (suspiciousCount > 0) return 'medium';
  
  return 'low';
}
```

### 2. Real-time Notifications

```typescript
// Add WebSocket support for real-time notifications
const ws = new WebSocket('wss://your-server.com/tracking');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'high_risk_activity') {
    // Show notification
    showNotification({
      title: 'High Risk Activity Detected',
      message: `${data.username} performed ${data.action}`,
      type: 'warning'
    });
  }
};
```

### 3. Geolocation Services

```typescript
// Integrate with IP geolocation services
async function getLocationFromIP(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    return {
      country: data.country_name,
      region: data.region,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      isp: data.org
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {};
  }
}
```

## 🔒 Privacy & Security

### 1. Data Protection

```typescript
// Encrypt sensitive data before storing
import CryptoJS from 'crypto-js';

const encryptData = (data: any, key: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptData = (encryptedData: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
```

### 2. Consent Management

```typescript
// Add consent tracking
const consentStatus = {
  locationTracking: false,
  activityMonitoring: false,
  deviceTracking: false
};

const requestConsent = async () => {
  const consent = await showConsentDialog({
    title: 'Tracking Consent',
    message: 'This application tracks your activity for security purposes.',
    options: ['location', 'activity', 'device']
  });
  
  consentStatus.locationTracking = consent.includes('location');
  consentStatus.activityMonitoring = consent.includes('activity');
  consentStatus.deviceTracking = consent.includes('device');
};
```

### 3. Data Retention

```typescript
// Implement data retention policies
const cleanupOldData = () => {
  const retentionPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days
  const cutoffTime = Date.now() - retentionPeriod;
  
  this.activities = this.activities.filter(activity => 
    activity.timestamp.getTime() > cutoffTime
  );
  
  this.saveActivities();
};
```

## 🚀 Production Deployment

### 1. Environment Variables

```env
# .env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_token
REACT_APP_TRACKING_ENABLED=true
REACT_APP_LOCATION_TRACKING=true
REACT_APP_WEBSOCKET_URL=wss://your-server.com
```

### 2. Backend Integration

```typescript
// API endpoints for tracking data
const API_ENDPOINTS = {
  ACTIVITIES: '/api/tracking/activities',
  SESSIONS: '/api/tracking/sessions',
  STATS: '/api/tracking/stats',
  ALERTS: '/api/tracking/alerts'
};

// Send tracking data to backend
const sendActivityToServer = async (activity: LiveActivity) => {
  try {
    await fetch(API_ENDPOINTS.ACTIVITIES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(activity)
    });
  } catch (error) {
    console.error('Error sending activity:', error);
  }
};
```

### 3. Performance Optimization

```typescript
// Debounce activity updates
import { debounce } from 'lodash';

const debouncedUpdate = debounce(() => {
  updateTrackingData();
}, 1000);

// Batch updates
const batchUpdate = (activities: LiveActivity[]) => {
  if (activities.length > 10) {
    sendBatchToServer(activities);
  }
};
```

## 📱 Mobile Support

### 1. Responsive Design

```css
/* Mobile-first design */
@media (max-width: 768px) {
  .tracking-panel {
    padding: 1rem;
  }
  
  .map-container {
    height: 300px;
  }
  
  .activity-feed {
    max-height: 200px;
  }
}
```

### 2. Touch Interactions

```typescript
// Handle touch events for mobile
const handleTouchStart = (event: TouchEvent) => {
  // Track touch interactions
  recordActivity({
    type: 'touch',
    target: event.target,
    timestamp: new Date()
  });
};
```

## 🔧 Troubleshooting

### Common Issues

1. **Location Permission Denied**
   ```typescript
   // Handle gracefully
   if (!navigator.geolocation) {
     console.log('Geolocation not supported');
     // Use IP-based location as fallback
   }
   ```

2. **High Memory Usage**
   ```typescript
   // Implement cleanup
   setInterval(() => {
     cleanupOldActivities();
   }, 60000); // Every minute
   ```

3. **Network Issues**
   ```typescript
   // Offline support
   if (!navigator.onLine) {
     // Store activities locally
     localStorage.setItem('offline_activities', JSON.stringify(activities));
   }
   ```

## 📈 Analytics & Reporting

### 1. Activity Analytics

```typescript
const getActivityAnalytics = () => {
  const activities = tracker.getRecentActivities();
  
  return {
    totalActivities: activities.length,
    uniqueUsers: new Set(activities.map(a => a.userId)).size,
    riskDistribution: getRiskDistribution(activities),
    deviceDistribution: getDeviceDistribution(activities),
    timeDistribution: getTimeDistribution(activities)
  };
};
```

### 2. Export Reports

```typescript
const exportTrackingReport = () => {
  const activities = tracker.getRecentActivities();
  const csv = convertToCSV(activities);
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `tracking-report-${new Date().toISOString()}.csv`;
  link.click();
};
```

## 🎯 Next Steps

1. **Choose a mapping service** (Google Maps, Mapbox, or Leaflet)
2. **Set up environment variables** for API keys
3. **Implement backend integration** for data persistence
4. **Add real-time notifications** using WebSockets
5. **Configure privacy settings** and consent management
6. **Test on different devices** and browsers
7. **Monitor performance** and optimize as needed

## 📞 Support

For questions or issues with live tracking integration:

- Check the browser console for errors
- Verify API keys and permissions
- Test with different user roles
- Monitor network requests
- Review privacy settings

The live tracking system is now fully integrated into your HavenX dashboard! 🎉 