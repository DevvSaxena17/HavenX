import React from 'react';
import { UserLogEntry } from '../types/security';
import { Activity, MapPin, Wifi, ExternalLink } from 'lucide-react';

interface ActivityLogProps {
  logs: UserLogEntry[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getRiskScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-400 bg-red-900';
    if (score >= 80) return 'text-orange-400 bg-orange-900';
    if (score >= 70) return 'text-yellow-400 bg-yellow-900';
    return 'text-green-400 bg-green-900';
  };

  const getAccessTypeIcon = (type: string) => {
    return type === 'external' ? 
      <ExternalLink className="h-4 w-4 text-orange-400" /> : 
      <Wifi className="h-4 w-4 text-blue-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <div className="flex items-center space-x-2 text-gray-400">
          <Activity className="h-5 w-5" />
          <span>{logs.length} activities logged</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedLogs.map((log, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-semibold text-lg">{log.username}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskScoreColor(log.risk_score)}`}>
                    Risk: {log.risk_score}%
                  </span>
                  <div className="flex items-center space-x-1">
                    {getAccessTypeIcon(log.access_type)}
                    <span className="text-sm text-gray-400 capitalize">{log.access_type}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-2">{log.action}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{log.location}</span>
                  </div>
                  <span>IP: {log.ip}</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
              
              <div className={`w-4 h-4 rounded-full ${
                log.risk_score >= 90 ? 'bg-red-500' :
                log.risk_score >= 80 ? 'bg-orange-500' :
                log.risk_score >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;