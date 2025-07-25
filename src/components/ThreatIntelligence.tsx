import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Eye,
  Shield,
  Activity,
  Globe,
  BarChart3
} from 'lucide-react';

interface ThreatEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  location: string;
  timestamp: Date;
  description: string;
  ip: string;
}

interface ThreatIntelligenceProps {
  userRole: string;
}

const ThreatIntelligence: React.FC<ThreatIntelligenceProps> = ({ userRole }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedView, setSelectedView] = useState('heatmap');

  // Mock data
  const threatEvents: ThreatEvent[] = [
    { id: '1', type: 'Suspicious Login', severity: 'high', user: 'Mike Davis', location: 'New York, US', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), description: 'Login from unknown device', ip: '192.168.1.105' },
    { id: '2', type: 'Data Export', severity: 'medium', user: 'Sarah Johnson', location: 'London, UK', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), description: 'Large file download detected', ip: '192.168.1.102' },
    { id: '3', type: 'Unauthorized Access', severity: 'critical', user: 'Unknown', location: 'Moscow, RU', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), description: 'Failed login attempts', ip: '185.220.101.45' },
    { id: '4', type: 'Suspicious Activity', severity: 'high', user: 'John Smith', location: 'Tokyo, JP', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), description: 'Access outside business hours', ip: '192.168.1.100' },
    { id: '5', type: 'Data Breach', severity: 'critical', user: 'Alice Johnson', location: 'Berlin, DE', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), description: 'Sensitive data accessed', ip: '192.168.1.103' },
  ];

  const threatCategories = [
    { name: 'Suspicious Logins', value: 35, color: '#FF3C3C' },
    { name: 'Data Exports', value: 25, color: '#FFA500' },
    { name: 'Unauthorized Access', value: 20, color: '#FF0000' },
    { name: 'Phishing Attempts', value: 15, color: '#9370DB' },
    { name: 'Malware Detection', value: 5, color: '#00FF00' },
  ];

  const locationData = [
    { location: 'New York, US', count: 15, lat: 40.7128, lng: -74.0060 },
    { location: 'London, UK', count: 12, lat: 51.5074, lng: -0.1278 },
    { location: 'Tokyo, JP', count: 8, lat: 35.6762, lng: 139.6503 },
    { location: 'Berlin, DE', count: 6, lat: 52.5200, lng: 13.4050 },
    { location: 'Moscow, RU', count: 4, lat: 55.7558, lng: 37.6176 },
  ];

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: '#00FF00',
      medium: '#FFA500',
      high: '#FF3C3C',
      critical: '#FF0000'
    };
    return colors[severity as keyof typeof colors] || '#B0B0B0';
  };

  const HeatmapView: React.FC = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Geographic Threat Distribution</h3>
      <div className="relative h-64 rounded-lg border overflow-hidden" style={{ backgroundColor: '#0D0D0D', borderColor: '#B0B0B0' }}>
        {/* Simplified world map representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[#B0B0B0] text-center">
            <Globe className="h-32 w-32 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Interactive World Map</p>
            <p className="text-xs">Click on locations to view details</p>
          </div>
        </div>
        
        {/* Threat indicators */}
        {locationData.map((loc, index) => (
          <motion.div
            key={loc.location}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.2 }}
            className="absolute w-4 h-4 rounded-full cursor-pointer"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index * 10)}%`,
              backgroundColor: getSeverityColor('high'),
              boxShadow: `0 0 20px ${getSeverityColor('high')}40`
            }}
            whileHover={{ scale: 1.5 }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {loc.location}: {loc.count} threats
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const RadarChartView: React.FC = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Threat Categories Over Time</h3>
      <div className="rounded-lg border p-6" style={{ backgroundColor: '#0D0D0D', borderColor: '#B0B0B0' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {threatCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm">{category.name}</span>
                  <span className="text-[#B0B0B0] text-sm">{category.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#1A1A1A' }}>
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.value}%` }}
                    transition={{ delay: index * 0.1, duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const TimelineView: React.FC = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Threat Timeline</h3>
      <div className="space-y-4">
        {threatEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-lg border" 
            style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
          >
            <div className="flex flex-col items-center">
              <div 
                className="w-3 h-3 rounded-full mb-2"
                style={{ backgroundColor: getSeverityColor(event.severity) }}
              />
              <div className="w-0.5 h-full" style={{ backgroundColor: '#B0B0B0' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h4 className="text-white font-medium">{event.type}</h4>
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${getSeverityColor(event.severity)}20`,
                      color: getSeverityColor(event.severity)
                    }}
                  >
                    {event.severity}
                  </span>
                </div>
                <span className="text-[#B0B0B0] text-sm">
                  {event.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-[#B0B0B0] text-sm mb-2">{event.description}</p>
              <div className="flex items-center space-x-4 text-xs text-[#B0B0B0]">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{event.user}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span>{event.ip}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const PieChartView: React.FC = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Risk Contribution by Department</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border p-6" style={{ backgroundColor: '#0D0D0D', borderColor: '#B0B0B0' }}>
          <h4 className="text-white font-medium mb-4">Department Risk Distribution</h4>
          <div className="space-y-3">
            {[
              { dept: 'Engineering', risk: 45, color: '#FF3C3C' },
              { dept: 'Finance', risk: 30, color: '#FFA500' },
              { dept: 'HR', risk: 15, color: '#00BFFF' },
              { dept: 'Marketing', risk: 10, color: '#00FF00' },
            ].map((dept, index) => (
              <motion.div
                key={dept.dept}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-white text-sm">{dept.dept}</span>
                </div>
                <span className="text-[#B0B0B0] text-sm">{dept.risk}%</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="rounded-lg border p-6" style={{ backgroundColor: '#0D0D0D', borderColor: '#B0B0B0' }}>
          <h4 className="text-white font-medium mb-4">User Risk Levels</h4>
          <div className="space-y-3">
            {[
              { user: 'Mike Davis', risk: 92, status: 'Suspended' },
              { user: 'Sarah Johnson', risk: 78, status: 'Warning' },
              { user: 'John Smith', risk: 65, status: 'Monitoring' },
              { user: 'Alice Brown', risk: 45, status: 'Normal' },
            ].map((user, index) => (
              <motion.div
                key={user.user}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <span className="text-white text-sm">{user.user}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[#B0B0B0] text-sm">{user.risk}%</span>
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: user.risk > 80 ? '#FF3C3C20' : user.risk > 60 ? '#FFA50020' : '#00FF0020',
                      color: user.risk > 80 ? '#FF3C3C' : user.risk > 60 ? '#FFA500' : '#00FF00'
                    }}
                  >
                    {user.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Threat Intelligence</h2>
        <div className="flex items-center space-x-4">
          {/* Timeframe selector */}
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-1 rounded border bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
            style={{ borderColor: '#B0B0B0' }}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          {/* View selector */}
          <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#B0B0B0' }}>
            {[
              { id: 'heatmap', label: 'Heatmap', icon: Globe },
              { id: 'radar', label: 'Radar', icon: BarChart3 },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'pie', label: 'Pie Chart', icon: TrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedView(id)}
                className={`px-3 py-1 flex items-center space-x-1 transition-colors ${
                  selectedView === id 
                    ? 'bg-[#FF3C3C] text-white' 
                    : 'bg-transparent text-[#B0B0B0] hover:bg-[#1A1A1A]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* View content */}
      {selectedView === 'heatmap' && <HeatmapView />}
      {selectedView === 'radar' && <RadarChartView />}
      {selectedView === 'timeline' && <TimelineView />}
      {selectedView === 'pie' && <PieChartView />}
    </div>
  );
};

export default ThreatIntelligence; 