import React from 'react';
import { User } from '../types/security';
import { Users, AlertTriangle, Clock } from 'lucide-react';

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const getRiskLevelBadge = (level: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (level) {
      case 'critical':
        return `${baseClasses} bg-red-900 text-red-300 border border-red-700`;
      case 'high':
        return `${baseClasses} bg-orange-900 text-orange-300 border border-orange-700`;
      case 'medium':
        return `${baseClasses} bg-yellow-900 text-yellow-300 border border-yellow-700`;
      case 'low':
        return `${baseClasses} bg-green-900 text-green-300 border border-green-700`;
      default:
        return `${baseClasses} bg-gray-900 text-gray-300 border border-gray-700`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Monitoring</h2>
        <div className="flex items-center space-x-2 text-gray-400">
          <Users className="h-5 w-5" />
          <span>{users.length} users monitored</span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-750">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Risk Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Risk Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Alerts</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.username} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        user.riskLevel === 'critical' ? 'bg-red-500' :
                        user.riskLevel === 'high' ? 'bg-orange-500' :
                        user.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.department}</td>
                  <td className="px-6 py-4">
                    <span className={getRiskLevelBadge(user.riskLevel)}>
                      {user.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${
                        user.averageRiskScore >= 90 ? 'text-red-400' :
                        user.averageRiskScore >= 80 ? 'text-orange-400' :
                        user.averageRiskScore >= 70 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {user.averageRiskScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        user.totalAlerts > 3 ? 'text-red-400' :
                        user.totalAlerts > 1 ? 'text-orange-400' : 'text-gray-400'
                      }`} />
                      <span>{user.totalAlerts}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(user.lastActivity).toLocaleDateString()} {new Date(user.lastActivity).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;