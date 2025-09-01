import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import DynamicSidebar from './components/DynamicSidebar';
import AICopilotPanel from './components/AICopilotPanel';
import ThreatIntelligence from './components/ThreatIntelligence';
import ModularWidgets from './components/ModularWidgets';
import { 
  LiveThreatsCard, 
  RiskScoreCard, 
  AnomalousLoginsCard, 
  ActiveUsersCard, 
  SystemHealthCard 
} from './components/NeonDashboardCard';
import AdminPanel from './components/AdminPanel';
import EmployeeDashboard from './components/EmployeeDashboard';
import InternDashboard from './components/InternDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './components/LoadingState';
import RealTimeDataManager from './utils/realTimeDataManager';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, error } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());

  // Track initial page view and activity
  useEffect(() => {
    if (user && isAuthenticated) {
      realTimeManager.recordPageView('dashboard');
    }
  }, [user, isAuthenticated, realTimeManager]);

  // Track tab changes
  useEffect(() => {
    if (user && isAuthenticated) {
      realTimeManager.recordAction('tab_change', activeTab, { newTab: activeTab });
    }
  }, [activeTab, user, isAuthenticated, realTimeManager]);

  // Track button interactions
  const trackButtonClick = useCallback((buttonName: string, action: string) => {
    if (user && isAuthenticated) {
      realTimeManager.recordAction(`button_click_${buttonName}`, activeTab, { action, buttonName });
    }
  }, [user, isAuthenticated, activeTab, realTimeManager]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        setIsAICopilotOpen(false);
        trackButtonClick('escape', 'close_modals');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trackButtonClick]);

  if (isLoading) {
    return (
      <LoadingState 
        message="Loading HavenX..." 
        size="lg" 
        fullScreen 
      />
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
      return <EmployeeDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
    } else if (user?.role === 'viewer') {
      return <InternDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
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
                    onClick={() => setIsAICopilotOpen(true)}
                    className="px-4 py-2 rounded-lg border bg-transparent text-[#B0B0B0] border-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                  >
                    AI Copilot
                  </button>
                </div>
              </div>

              {/* Real-Time Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LiveThreatsCard />
                <RiskScoreCard />
                <AnomalousLoginsCard />
                <ActiveUsersCard />
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
                  <SystemHealthCard />
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
      
      <main
        className={`flex-1 p-0 transition-all duration-300 overflow-auto ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}
      >
        {renderDashboardContent()}
      </main>
      
      {/* AI Copilot Panel */}
      <AICopilotPanel
        isOpen={isAICopilotOpen}
        onToggle={() => setIsAICopilotOpen(!isAICopilotOpen)}
        userRole={user?.role || 'viewer'}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="relative">
          <AppContent />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A1A1A',
                color: '#FFFFFF',
                border: '1px solid #B0B0B0',
                borderRadius: '8px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#FFFFFF',
                },
                style: {
                  border: '1px solid #22C55E',
                },
              },
              error: {
                iconTheme: {
                  primary: '#FF3C3C',
                  secondary: '#FFFFFF',
                },
                style: {
                  border: '1px solid #FF3C3C',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#FF3C3C',
                  secondary: '#FFFFFF',
                },
                style: {
                  border: '1px solid #FF3C3C',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
