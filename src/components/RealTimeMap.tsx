import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, Globe, Navigation, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import LiveTracker, { LiveActivity } from '../utils/liveTracker';
import TimeUtils from '../utils/timeUtils';

interface RealTimeMapProps {
  activities: LiveActivity[];
  onUserSelect?: (activity: LiveActivity) => void;
}

const RealTimeMap: React.FC<RealTimeMapProps> = ({ activities, onUserSelect }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India center
  const [zoom, setZoom] = useState(5);
  const [selectedUser, setSelectedUser] = useState<LiveActivity | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Filter activities with location data
  const activitiesWithLocation = activities.filter(
    activity => activity.locationInfo.latitude && activity.locationInfo.longitude
  );

  const handleUserClick = (activity: LiveActivity) => {
    setSelectedUser(activity);
    if (onUserSelect) {
      onUserSelect(activity);
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 1, 18));
  const zoomOut = () => setZoom(prev => Math.max(prev - 1, 1));

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      case 'desktop': return '💻';
      default: return '💻';
    }
  };

  // Simulate map rendering (in real implementation, you'd use Google Maps, Mapbox, or Leaflet)
  const renderMap = () => (
    <div 
      ref={mapRef}
      className="w-full h-full bg-gray-800 rounded-lg relative overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #1e3a8a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1e40af 0%, transparent 50%)' }}
    >
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={zoomIn}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`p-2 rounded-lg shadow-lg transition-colors ${
            showHeatmap ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
          }`}
        >
          <Layers className="h-4 w-4" />
        </button>
      </div>

      {/* Zoom Level Display */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-1 shadow-lg">
        <span className="text-sm font-medium">Zoom: {zoom}</span>
      </div>

      {/* User Markers */}
      {activitiesWithLocation.map((activity) => (
        <div
          key={activity.id}
          onClick={() => handleUserClick(activity)}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${((activity.locationInfo.longitude! + 180) / 360) * 100}%`,
            top: `${((90 - activity.locationInfo.latitude!) / 180) * 100}%`,
          }}
        >
          <div className="relative">
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs"
              style={{ backgroundColor: getRiskColor(activity.riskLevel) }}
            >
              {getDeviceIcon(activity.deviceInfo.deviceType)}
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </div>
      ))}

      {/* Heatmap Overlay */}
      {showHeatmap && (
        <div className="absolute inset-0 pointer-events-none">
          {activitiesWithLocation.map((activity) => (
            <div
              key={`heatmap-${activity.id}`}
              className="absolute rounded-full opacity-20"
              style={{
                left: `${((activity.locationInfo.longitude! + 180) / 360) * 100}%`,
                top: `${((90 - activity.locationInfo.latitude!) / 180) * 100}%`,
                width: `${Math.max(20, zoom * 2)}px`,
                height: `${Math.max(20, zoom * 2)}px`,
                backgroundColor: getRiskColor(activity.riskLevel),
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      )}

      {/* Activity Count */}
      <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">
            {activitiesWithLocation.length} Active Users
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Real-Time User Locations</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {activitiesWithLocation.length} users with location data
          </span>
        </div>
      </div>

      <div className="h-96 rounded-lg overflow-hidden">
        {renderMap()}
      </div>

      {/* User Details Panel */}
      {selectedUser && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">User Details</h4>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Username:</span>
              <span className="text-white ml-2">{selectedUser.username}</span>
            </div>
            <div>
              <span className="text-gray-400">Device:</span>
              <span className="text-white ml-2">{selectedUser.deviceInfo.deviceType}</span>
            </div>
            <div>
              <span className="text-gray-400">Location:</span>
              <span className="text-white ml-2">
                {selectedUser.locationInfo.latitude?.toFixed(4)}, {selectedUser.locationInfo.longitude?.toFixed(4)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Risk Level:</span>
              <span 
                className="ml-2 px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  color: getRiskColor(selectedUser.riskLevel),
                  backgroundColor: `${getRiskColor(selectedUser.riskLevel)}20`
                }}
              >
                {selectedUser.riskLevel.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Last Activity:</span>
              <span className="text-white ml-2">
                {TimeUtils.getInstance().formatForActivity(selectedUser.timestamp)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Action:</span>
              <span className="text-white ml-2">{selectedUser.action}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeMap; 