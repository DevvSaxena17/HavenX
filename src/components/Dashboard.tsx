import React, { useState } from 'react';
import { Shield, Users, AlertTriangle, Activity, FileText, Clock, TrendingUp, TrendingDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminPanel from './AdminPanel';
import EmployeeDashboard from './EmployeeDashboard';
import InternDashboard from './InternDashboard';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, logout } = useAuth();

  // Mock data for the dashboard
  const recentAlerts = [
    { user: 'John Doe', action: 'Downloaded 4 files', time: '12 minutes ago' },
    { user: 'Jane Smith', action: 'Logged in from unusual location', time: '25 minutes ago' },
    { user: 'Alice Johnson', action: 'Accessed sensitive info outside working hours', time: '1 hour ago' },
    { user: 'Bob Wilson', action: 'Failed login attempt', time: '2 hours ago' },
    { user: 'Carol Davis', action: 'Exported large dataset', time: '3 hours ago' },
  ];

  // Risk score data for the chart
  const riskScoreData = [25, 35, 45, 60, 75, 85, 95];

  // Line chart component for risk score
  const RiskScoreChart = ({ data, color, height = 200 }: { data: number[], color: string, height?: number }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative" style={{ height }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 20, 40, 60, 80, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#B0B0B0"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          {/* Line chart */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            points={points}
          />
          {/* Area fill */}
          <polygon
            fill={color}
            opacity="0.2"
            points={`0,100 ${points} 100,100`}
          />
        </svg>
      </div>
    );
  };

  const handleLogout = () => {
    logout();
  };

  // Route users to their specific dashboards based on role
  if (user?.role === 'admin') {
    return <AdminPanel />;
  }

  if (user?.role === 'analyst') {
    return <EmployeeDashboard />;
  }

  if (user?.role === 'viewer') {
    return <InternDashboard />;
  }

  // Default dashboard (fallback)
  return (
    <div className="min-h-screen text-white flex" style={{ backgroundColor: '#0D0D0D' }}>
      {/* Left Sidebar - Navigation Panel */}
      <aside className="w-64 min-h-screen" style={{ backgroundColor: '#0D0D0D', width: '20%' }}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF3C3C' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ShadowHawk</span>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-[#B0B0B0]" />
                <span className="text-white text-sm font-medium">{user.name}</span>
              </div>
              <div className="text-[#B0B0B0] text-xs">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.username}
              </div>
            </div>
          )}
          
          <nav className="space-y-2 mb-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'dashboard' 
                  ? 'text-white' 
                  : 'text-[#B0B0B0] hover:bg-[#1A1A1A]'
              }`}
              style={{ 
                backgroundColor: activeTab === 'dashboard' ? '#FF3C3C' : 'transparent'
              }}
            >
              <FileText className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'logs' 
                  ? 'text-white' 
                  : 'text-[#B0B0B0] hover:bg-[#1A1A1A]'
              }`}
              style={{ 
                backgroundColor: activeTab === 'logs' ? '#FF3C3C' : 'transparent'
              }}
            >
              <FileText className="h-5 w-5" />
              <span>User Logs</span>
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'alerts' 
                  ? 'text-white' 
                  : 'text-[#B0B0B0] hover:bg-[#1A1A1A]'
              }`}
              style={{ 
                backgroundColor: activeTab === 'alerts' ? '#FF3C3C' : 'transparent'
              }}
            >
              <Clock className="h-5 w-5" />
              <span>Alerts</span>
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'risk' 
                  ? 'text-white' 
                  : 'text-[#B0B0B0] hover:bg-[#1A1A1A]'
              }`}
              style={{ 
                backgroundColor: activeTab === 'risk' ? '#FF3C3C' : 'transparent'
              }}
            >
              <TrendingUp className="h-5 w-5" />
              <span>Risk Graph</span>
            </button>
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-[#B0B0B0] hover:bg-[#1A1A1A] hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Area - 2x2 Grid Layout */}
      <main className="flex-1 p-6" style={{ width: '80%' }}>
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Top Row */}
          <div className="space-y-6">
            {/* Top Left - Risk Overview */}
            <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
              <h3 className="text-[#B0B0B0] text-lg mb-4">Risk Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[#B0B0B0] text-sm mb-2">Current risk level:</p>
                  <p className="text-3xl font-bold text-[#FF3C3C]">High</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF3C3C' }}></div>
                  <span className="text-white text-sm">Critical security alert</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D10000' }}></div>
                  <span className="text-white text-sm">Multiple suspicious activities detected</span>
                </div>
              </div>
            </div>

            {/* Bottom Left - Quick Stats */}
            <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
              <h3 className="text-[#B0B0B0] text-lg mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Users Monitored:</span>
                  <span className="text-2xl font-bold text-white">1,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Alerts Today:</span>
                  <span className="text-2xl font-bold text-[#FF3C3C]">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">High-Risk Users:</span>
                  <span className="text-2xl font-bold text-[#FF3C3C]">3</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Top Right - Recent Alerts */}
            <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
              <h3 className="text-[#B0B0B0] text-lg mb-4">Recent Alerts</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="border-b pb-3" style={{ borderColor: '#B0B0B0' }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-medium">{alert.user}</p>
                        <p className="text-[#B0B0B0] text-sm">{alert.action}</p>
                      </div>
                      <span className="text-[#B0B0B0] text-xs">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Right - Risk Score Over Time */}
            <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
              <h3 className="text-[#B0B0B0] text-lg mb-4">Risk Score Over Time</h3>
              <div className="mb-4">
                <RiskScoreChart data={riskScoreData} color="#FF2C2C" height={150} />
              </div>
              <div className="flex justify-between text-xs text-[#B0B0B0]">
                <span>Apr 5</span>
                <span>Apr 6</span>
                <span>Apr 7</span>
                <span>Apr 8</span>
                <span>Apr 9</span>
                <span>Apr 10</span>
                <span>Apr 11</span>
              </div>
              <div className="flex justify-between text-xs text-[#B0B0B0] mt-1">
                <span>20</span>
                <span>40</span>
                <span>60</span>
                <span>80</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;