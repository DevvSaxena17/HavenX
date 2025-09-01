import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Activity, 
  AlertTriangle, 
  Users, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet,
  Clock,
  Eye,
  Shield,
  TrendingUp,
  RefreshCw,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Play,
  Pause,
  Square,
  Maximize2,
  Minimize2
} from 'lucide-react';
import LiveTracker, { LiveActivity, TrackingConfig } from '../utils/liveTracker';
import CSVManager from '../utils/csvManager';
import TimeUtils from '../utils/timeUtils';

interface LiveTrackingPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LiveTrackingPanel: React.FC<LiveTrackingPanelProps> = ({ isOpen, onToggle }) => {
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [activeSessions, setActiveSessions] = useState<LiveActivity[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isTracking, setIsTracking] = useState(true);
  const [config, setConfig] = useState<TrackingConfig>({
    enableLocationTracking: true,
    enableDeviceTracking: true,
    enableActivityMonitoring: true,
    updateInterval: 30000,
    maxSessionDuration: 480
  });
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<LiveActivity | null>(null);
  
  const tracker = useRef<LiveTracker>(LiveTracker.getInstance());
  const csvManager = useRef<CSVManager>(CSVManager.getInstance());
  const updateInterval = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      startLiveUpdates();
      return () => stopLiveUpdates();
    }
  }, [isOpen]);

  const startLiveUpdates = () => {
    updateInterval.current = setInterval(() => {
      updateTrackingData();
    }, 5000); // Update every 5 seconds
  };

  const stopLiveUpdates = () => {
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }
  };

  const updateTrackingData = () => {
    const recentActivities = tracker.current.getRecentActivities();
    const activeSessions = tracker.current.getActiveSessions();
    const stats = tracker.current.getActivityStats();

    setActivities(recentActivities);
    setActiveSessions(activeSessions);
    setStats(stats);
  };

  const toggleTracking = () => {
    if (isTracking) {
      tracker.current.stopTracking();
      setIsTracking(false);
    } else {
      tracker.current.startTracking();
      setIsTracking(true);
    }
  };

  const getFilteredActivities = () => {
    let filtered = activities;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.deviceInfo.deviceType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply risk level filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(activity => activity.riskLevel === selectedFilter);
    }

    return filtered;
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500 bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-900/20';
      default: return 'text-gray-500 bg-gray-900/20';
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const timeUtils = TimeUtils.getInstance();
    return timeUtils.getRelativeTimeShort(timestamp);
  };

  const renderActivityFeed = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live Activity Feed</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTracking}
            className={`p-2 rounded-lg transition-colors ${
              isTracking ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
            }`}
          >
            {isTracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={updateTrackingData}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Activities</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
          <option value="critical">Critical Risk</option>
        </select>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {getFilteredActivities().map((activity) => (
          <div
            key={activity.id}
            onClick={() => setSelectedActivity(activity)}
            className="p-4 rounded-lg border cursor-pointer hover:bg-gray-800 transition-colors"
            style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getDeviceIcon(activity.deviceInfo.deviceType)}
                  <span className="text-white font-medium">{activity.username}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(activity.riskLevel)}`}>
                  {activity.riskLevel.toUpperCase()}
                </span>
              </div>
              <span className="text-gray-400 text-sm">{formatTimestamp(activity.timestamp)}</span>
            </div>
            <p className="text-gray-300 text-sm mt-2">{activity.action}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
              <span>{activity.deviceInfo.os} • {activity.deviceInfo.browser}</span>
              {activity.locationInfo.city && (
                <span className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{activity.locationInfo.city}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActiveSessions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeSessions.map((session) => (
          <div
            key={session.sessionId}
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-white font-medium">{session.username}</span>
              </div>
              {getDeviceIcon(session.deviceInfo.deviceType)}
            </div>
            <p className="text-gray-300 text-sm">{session.deviceInfo.os} • {session.deviceInfo.browser}</p>
            <p className="text-gray-400 text-xs mt-1">
              Active for {formatTimestamp(session.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="text-2xl font-bold text-white">{stats.totalActivities || 0}</div>
        <div className="text-gray-400 text-sm">Total Activities</div>
      </div>
      <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="text-2xl font-bold text-white">{stats.activeSessions || 0}</div>
        <div className="text-gray-400 text-sm">Active Sessions</div>
      </div>
      <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="text-2xl font-bold text-green-500">{stats.recentActivities || 0}</div>
        <div className="text-gray-400 text-sm">Recent (1h)</div>
      </div>
      <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="text-2xl font-bold text-red-500">
          {(stats.riskDistribution?.critical || 0) + (stats.riskDistribution?.high || 0)}
        </div>
        <div className="text-gray-400 text-sm">High Risk</div>
      </div>
    </div>
  );

  const renderActivityDetails = () => {
    if (!selectedActivity) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Activity Details</h3>
            <button
              onClick={() => setSelectedActivity(null)}
              className="text-gray-400 hover:text-white"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">User Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Username:</span>
                  <span className="text-white ml-2">{selectedActivity.username}</span>
                </div>
                <div>
                  <span className="text-gray-400">Session ID:</span>
                  <span className="text-white ml-2">{selectedActivity.sessionId}</span>
                </div>
                <div>
                  <span className="text-gray-400">Action:</span>
                  <span className="text-white ml-2">{selectedActivity.action}</span>
                </div>
                <div>
                  <span className="text-gray-400">Risk Level:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(selectedActivity.riskLevel)}`}>
                    {selectedActivity.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Device Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Device Type:</span>
                  <span className="text-white ml-2">{selectedActivity.deviceInfo.deviceType}</span>
                </div>
                <div>
                  <span className="text-gray-400">Operating System:</span>
                  <span className="text-white ml-2">{selectedActivity.deviceInfo.os}</span>
                </div>
                <div>
                  <span className="text-gray-400">Browser:</span>
                  <span className="text-white ml-2">{selectedActivity.deviceInfo.browser}</span>
                </div>
                <div>
                  <span className="text-gray-400">Screen Resolution:</span>
                  <span className="text-white ml-2">{selectedActivity.deviceInfo.screenResolution}</span>
                </div>
                <div>
                  <span className="text-gray-400">Timezone:</span>
                  <span className="text-white ml-2">{selectedActivity.deviceInfo.timezone}</span>
                </div>
                <div>
                  <span className="text-gray-400">Language:</span>
                  <span className="text-white ml-2">{selectedActivity.deviceInfo.language}</span>
                </div>
              </div>
            </div>

            {selectedActivity.locationInfo.latitude && (
              <div>
                <h4 className="text-white font-medium mb-2">Location Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Latitude:</span>
                    <span className="text-white ml-2">{selectedActivity.locationInfo.latitude}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Longitude:</span>
                    <span className="text-white ml-2">{selectedActivity.locationInfo.longitude}</span>
                  </div>
                  {selectedActivity.locationInfo.city && (
                    <div>
                      <span className="text-gray-400">City:</span>
                      <span className="text-white ml-2">{selectedActivity.locationInfo.city}</span>
                    </div>
                  )}
                  {selectedActivity.locationInfo.country && (
                    <div>
                      <span className="text-gray-400">Country:</span>
                      <span className="text-white ml-2">{selectedActivity.locationInfo.country}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-white font-medium mb-2">Network Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">IP Address:</span>
                  <span className="text-white ml-2">{selectedActivity.ipAddress}</span>
                </div>
                <div>
                  <span className="text-gray-400">User Agent:</span>
                  <span className="text-white ml-2 text-xs">{selectedActivity.userAgent}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] ${
      isFullscreen ? 'p-0' : 'p-4'
    }`}>
      <div className={`bg-gray-900 rounded-lg shadow-2xl ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-7xl h-[90vh]'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Live Tracking Dashboard</h2>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isTracking ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {isTracking ? 'LIVE' : 'PAUSED'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              <Square className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          <div className="space-y-6">
            {renderStats()}
            {renderActiveSessions()}
            {renderActivityFeed()}
          </div>
        </div>

        {renderActivityDetails()}
      </div>
    </div>
  );
};

export default LiveTrackingPanel; 