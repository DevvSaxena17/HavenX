import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Brain, 
  Settings, 
  FileText, 
  Activity, 
  BarChart3, 
  LogOut,
  User,
  TrendingUp,
  Bell,
  MessageSquare,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  Eye,
  MapPin,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
  allowedRoles: string[];
}

const DynamicSidebar: React.FC<{ 
  activeTab: string; 
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Mock badge data
  const badgeData = {
    'ai-insights': 3,
    'notifications': 5,
    'support': 2,
    'alerts': 8
  };

  const sidebarItems: SidebarItem[] = [
    // Admin items
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, allowedRoles: ['admin'] },
    { id: 'users', label: 'Users', icon: Users, badge: 12, allowedRoles: ['admin'] },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain, badge: badgeData['ai-insights'], allowedRoles: ['admin'] },
    { id: 'policies', label: 'Policies', icon: Settings, allowedRoles: ['admin'] },
    { id: 'reports', label: 'Reports', icon: FileText, allowedRoles: ['admin'] },
    { id: 'logs', label: 'Logs', icon: Activity, allowedRoles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, allowedRoles: ['admin'] },
    
    // Employee items
    { id: 'activity', label: 'My Activity', icon: Activity, allowedRoles: ['analyst'] },
    { id: 'security', label: 'Security Score', icon: TrendingUp, allowedRoles: ['analyst'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: badgeData['notifications'], allowedRoles: ['analyst'] },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Brain, allowedRoles: ['analyst'] },
    { id: 'support', label: 'Support', icon: MessageSquare, badge: badgeData['support'], allowedRoles: ['analyst'] },
    
    // Intern items
    { id: 'activity', label: 'My Activity', icon: Activity, allowedRoles: ['viewer'] },
    { id: 'tips', label: 'Security Tips', icon: BookOpen, allowedRoles: ['viewer'] },
    { id: 'ai-bot', label: 'AI Bot', icon: Brain, allowedRoles: ['viewer'] },
    { id: 'helpdesk', label: 'Helpdesk', icon: MessageSquare, allowedRoles: ['viewer'] },
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const filteredItems = sidebarItems.filter(item => 
    user && item.allowedRoles.includes(user.role)
  );

  return (
    <aside 
      className={`fixed left-0 top-0 min-h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`} 
      style={{ backgroundColor: '#0D0D0D' }}
    >
      <div className="p-6 pb-16 relative h-full flex flex-col">
        {/* Header */}
        <div className={`flex items-center justify-between mb-8`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF3C3C' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && <span className="text-xl font-bold text-white">ShadowHawk</span>}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-[#1A1A1A] transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-[#FF3C3C]" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-[#B0B0B0]" />
            )}
          </button>
        </div>
        
        {/* User Info */}
        {user && (
          <div className={`mb-6 ${isCollapsed ? 'p-2' : 'p-3'} rounded-lg`} style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} ${!isCollapsed ? 'mb-2' : ''}`}>
              <User className="h-4 w-4 text-[#B0B0B0]" />
              {!isCollapsed && <span className="text-white text-sm font-medium">{user.name}</span>}
            </div>
            {!isCollapsed && (
              <div className="text-[#B0B0B0] text-xs">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.username}
              </div>
            )}
          </div>
        )}
        
        {/* Navigation */}
        <nav className="space-y-2 mb-6">
          {filteredItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} ${isCollapsed ? 'px-2' : 'px-3'} py-2 rounded-lg transition-colors ${
                activeTab === id 
                  ? 'text-white font-medium' 
                  : 'text-[#B0B0B0] hover:bg-[#1A1A1A] hover:text-white'
              }`}
              style={{ 
                backgroundColor: activeTab === id ? '#FF3C3C' : 'transparent',
                border: activeTab === id ? '1px solid #FF3C3C' : 'none'
              }}
            >
              <div className={`flex items-center ${!isCollapsed ? 'space-x-3' : ''}`}>
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span>{label}</span>}
              </div>
              {badge && !isCollapsed && (
                <span className="px-2 py-1 text-xs rounded-full font-bold text-white" style={{ backgroundColor: '#FF3C3C', boxShadow: '0 0 8px rgba(255, 60, 60, 0.5)' }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} ${isCollapsed ? 'px-2' : 'px-3'} py-2 rounded-lg transition-colors text-[#B0B0B0] hover:bg-[#1A1A1A] hover:text-white`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
        
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg p-6 max-w-sm w-full mx-4" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0', border: '1px solid #B0B0B0' }}>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FF3C3C' }}>
                <LogOut className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Confirm Logout</h3>
              <p className="text-[#B0B0B0] mb-6">Are you sure you want to logout?</p>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 rounded-lg border transition-colors text-[#B0B0B0] border-[#B0B0B0] hover:bg-[#0D0D0D] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors text-white font-medium"
                  style={{ backgroundColor: '#FF3C3C' }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DynamicSidebar; 