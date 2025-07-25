import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import DynamicSidebar from './components/DynamicSidebar';
import AICopilotPanel from './components/AICopilotPanel';
import CommandBar from './components/CommandBar';
import ThreatIntelligence from './components/ThreatIntelligence';
import ModularWidgets from './components/ModularWidgets';
import NeonDashboardCard, { 
  LiveThreatsCard, 
  RiskScoreCard, 
  AnomalousLoginsCard, 
  ActiveUsersCard, 
  SystemHealthCard 
} from './components/NeonDashboardCard';
import AdminPanel from './components/AdminPanel';
import EmployeeDashboard from './components/EmployeeDashboard';
import InternDashboard from './components/InternDashboard';
import RoleGuard from './components/RoleGuard';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, error } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for command bar
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(true);
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        setIsCommandBarOpen(false);
        setIsAICopilotOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF3C3C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading ShadowHawk...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} isLoading={isLoading} error={error || undefined} />;
  }

  // Render dashboard based on user role
  const renderDashboardContent = () => {
    if (user?.role === 'admin') {
      return <AdminPanel activeTab={activeTab} onTabChange={setActiveTab} />;
    } else if (user?.role === 'analyst') {
      return <EmployeeDashboard />;
    } else if (user?.role === 'viewer') {
      return <InternDashboard />;
    } else {
      // Default dashboard with advanced features
      return (
        <>
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Advanced Dashboard</h1>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsCommandBarOpen(true)}
                    className="px-4 py-2 rounded-lg border bg-transparent text-[#B0B0B0] border-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                  >
                    ⌘K Search
                  </button>
                  <button
                    onClick={() => setIsAICopilotOpen(true)}
                    className="px-4 py-2 rounded-lg border bg-transparent text-[#B0B0B0] border-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                  >
                    AI Copilot
                  </button>
                </div>
              </div>

              {/* Neon Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LiveThreatsCard count={15} change={12} />
                <RiskScoreCard score={85} change={8} />
                <AnomalousLoginsCard count={8} change={-3} />
                <ActiveUsersCard count={1250} change={5} />
              </div>

              {/* Threat Intelligence */}
              <ThreatIntelligence userRole={user?.role || 'viewer'} />

              {/* Modular Widgets */}
              <ModularWidgets userRole={user?.role || 'viewer'} />
            </div>
          )}

          {activeTab === 'threats' && (
            <ThreatIntelligence userRole={user?.role || 'viewer'} />
          )}

          {activeTab === 'widgets' && (
            <ModularWidgets userRole={user?.role || 'viewer'} />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Advanced Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
                  <h3 className="text-lg font-semibold text-white mb-4">System Health Overview</h3>
                  <SystemHealthCard status="Healthy" uptime="99.9%" />
                </div>
                <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">CPU Usage</span>
                      <span className="text-green-400">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Memory Usage</span>
                      <span className="text-yellow-400">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Network Traffic</span>
                      <span className="text-blue-400">82%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="min-h-screen flex relative" style={{ backgroundColor: '#0D0D0D' }}>
      <DynamicSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className={`flex-1 p-0 transition-all duration-300 overflow-auto ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {renderDashboardContent()}
      </main>

      <AICopilotPanel
        isOpen={isAICopilotOpen}
        onToggle={() => setIsAICopilotOpen(!isAICopilotOpen)}
        userRole={user?.role || 'viewer'}
      />

      <CommandBar
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
        userRole={user?.role || 'viewer'}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;