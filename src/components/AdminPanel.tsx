import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Brain, 
  Settings, 
  FileText, 
  Activity, 
  BarChart3, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Smartphone, 
  LogOut,
  User,
  TrendingUp,
  Lock,
  Bell,
  Database,
  Server,
  Network,
  ShieldCheck,
  AlertCircle,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  Calendar,
  Mail,
  MessageSquare,
  Key,
  Globe,
  Monitor,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from './UserManagement';
import CSVExport from './CSVExport';
import CSVManager from '../utils/csvManager';
import RealTimeDataManager from '../utils/realTimeDataManager';
import AIEnhancedManager from '../utils/aiEnhanced';
import { secureStorage, logSecurityEvent, rateLimiter } from '../utils/securityUtils';
import LiveTrackingPanel from './LiveTrackingPanel';
import RealTimeMap from './RealTimeMap';
import LiveTracker, { LiveActivity } from '../utils/liveTracker';
import TimeUtils from '../utils/timeUtils';
import LiveClock from './LiveClock';
// Recharts imports
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { motion } from "framer-motion";

interface AdminPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  dimCharts?: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ activeTab, onTabChange, dimCharts = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [csvManager] = useState(() => CSVManager.getInstance());
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());
  const [aiManager] = useState(() => AIEnhancedManager.getInstance());
  const [liveTracker] = useState(() => LiveTracker.getInstance());
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
  const [isLiveTrackingOpen, setIsLiveTrackingOpen] = useState(false);
  const [timeUtils] = useState(() => TimeUtils.getInstance());
  
  // Enhanced Admin State
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [showAutomationPanel, setShowAutomationPanel] = useState(false);
  const [alertThresholds, setAlertThresholds] = useState({
    cpuThreshold: 80,
    memoryThreshold: 85,
    storageThreshold: 90,
    failedLoginThreshold: 5,
    dataExportThreshold: 1000 // MB
  });
  const [quickActions, setQuickActions] = useState({
    lockAllSessions: false,
    enableEmergencyMode: false,
    pauseDataExports: false
  });
  const [systemNotifications, setSystemNotifications] = useState<any[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [threatIntelligence, setThreatIntelligence] = useState<any[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 65,
    memoryUsage: 78,
    storageUsage: 45,
    networkTraffic: 82,
    activeUsers: 0,
    totalAlerts: 0,
    resolvedIncidents: 8,
    pendingActions: 3
  });
  
  // User management state (moved from renderUsers to avoid hook order issues)
  const users = csvManager.getAllUsers();
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filterType, setFilterType] = useState('all');
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const { user, logout } = useAuth();

  // Update system metrics with real-time data
  useEffect(() => {
    const updateMetrics = () => {
      try {
        console.log('RealTimeManager instance:', realTimeManager);
        console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(realTimeManager)));
        
        // Simple fallback approach
        let activeUsers = 1; // Default to at least 1 (current user)
        let totalAlerts = 0;
        
        // Try to get real data if methods exist
        if (realTimeManager && typeof realTimeManager.getCurrentMetrics === 'function') {
          try {
            const metrics = realTimeManager.getCurrentMetrics();
            console.log('Current metrics:', metrics);
            activeUsers = metrics.activeUsers || activeUsers;
          } catch (err) {
            console.warn('Error calling getCurrentMetrics:', err);
          }
        }
        
        if (realTimeManager && typeof realTimeManager.getActiveThreatsCount === 'function') {
          try {
            totalAlerts = realTimeManager.getActiveThreatsCount();
          } catch (err) {
            console.warn('Error calling getActiveThreatsCount:', err);
          }
        }
        
        // Update with fallback values
        setSystemMetrics(prev => ({
          ...prev,
          activeUsers,
          totalAlerts
        }));
        
      } catch (error) {
        console.error('Error in updateMetrics:', error);
        // Use default values on error
        setSystemMetrics(prev => ({
          ...prev,
          activeUsers: 1,
          totalAlerts: 0
        }));
      }
    };

    // Initial update with delay to ensure components are mounted
    setTimeout(updateMetrics, 100);

    // Set up interval for updates
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [realTimeManager]);

  // Update live activities
  useEffect(() => {
    const updateActivities = () => {
      const activities = liveTracker.getRecentActivities(50);
      setLiveActivities(activities);
    };

    // Initial update
    updateActivities();

    // Set up interval for updates
    const interval = setInterval(updateActivities, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [liveTracker]);

  // Mock data with Hindi names
  const employees = [
    { id: 1, name: 'Devv Saxena', role: 'System Administrator', department: 'IT', riskScore: 95, status: 'active', lastLogin: '2 hours ago', location: 'Office' },
    { id: 2, name: 'Priyanshi Saxena', role: 'Security Analyst', department: 'Security', riskScore: 88, status: 'active', lastLogin: '1 hour ago', location: 'Remote' },
    { id: 3, name: 'Mohak', role: 'Software Engineer', department: 'Engineering', riskScore: 75, status: 'active', lastLogin: '30 minutes ago', location: 'Office' },
    { id: 4, name: 'Tushar Suthar', role: 'Marketing Specialist', department: 'Marketing', riskScore: 82, status: 'active', lastLogin: '45 minutes ago', location: 'Remote' },
    { id: 5, name: 'Riya Raut', role: 'HR Coordinator', department: 'HR', riskScore: 78, status: 'active', lastLogin: '15 minutes ago', location: 'Office' },
  ];

  const threats = [
    { id: 1, type: 'Suspicious Login', severity: 'high', user: 'Mohak', time: '2 hours ago', status: 'active' },
    { id: 2, type: 'Data Export', severity: 'medium', user: 'Tushar Suthar', time: '4 hours ago', status: 'resolved' },
    { id: 3, type: 'Unauthorized Access', severity: 'critical', user: 'Unknown', time: '1 hour ago', status: 'active' },
  ];

  const riskScoreData = [
    { date: 'Mon', score: 72 },
    { date: 'Tue', score: 75 },
    { date: 'Wed', score: 78 },
    { date: 'Thu', score: 80 },
    { date: 'Fri', score: 85 },
    { date: 'Sat', score: 83 },
    { date: 'Sun', score: 87 },
  ];
  const threatTypeData = [
    { type: 'Phishing', count: 12 },
    { type: 'Insider', count: 7 },
    { type: 'Malware', count: 9 },
    { type: 'Ransomware', count: 4 },
    { type: 'Other', count: 3 },
  ];
  const userRiskData = [
    { level: 'Low', value: 60 },
    { level: 'Medium', value: 25 },
    { level: 'High', value: 10 },
    { level: 'Critical', value: 5 },
  ];
  const riskColors = dimCharts 
    ? ['#102a1a', '#2a2100', '#2a1800', '#2a1010']
    : ['#22c55e', '#eab308', '#f97316', '#ef4444'];

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

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    // Check rate limiting
    if (!rateLimiter.isAllowed(user?.id || 'anonymous', 5, 60000)) {
      setAiResponse('⚠️ **Rate Limit Exceeded**\n\nToo many requests. Please wait before asking another question.');
      return;
    }
    
    // Log security event for AI query
    logSecurityEvent({
      type: 'ai_query',
      severity: 'low',
      details: { query: aiQuery, userId: user?.id }
    });
    
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      // Use enhanced AI system for query processing
      const aiResult = aiManager.processNaturalLanguageQuery(aiQuery);
      
      // Simulate AI processing delay for realism
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      
      // Add confidence score to response
      const confidenceText = aiResult.confidence > 0.8 ? '🟢 High Confidence' : 
                           aiResult.confidence > 0.6 ? '🟡 Medium Confidence' : 
                           '🔴 Low Confidence';
      
      const enhancedResponse = `${aiResult.response}\n\n---\n**Analysis:** ${confidenceText} (${(aiResult.confidence * 100).toFixed(0)}%)\n**Intent:** ${aiResult.intent.replace('_', ' ').toUpperCase()}\n${aiResult.entities.length > 0 ? `**Entities:** ${aiResult.entities.join(', ')}` : ''}`;
      
      setAiResponse(enhancedResponse);
      
    } catch (error) {
      console.error('AI Query Error:', error);
      setAiResponse('❌ **Error Processing Query**\n\nSorry, I encountered an issue processing your request. Please try again or rephrase your question.');
      
      logSecurityEvent({
        type: 'ai_query_error',
        severity: 'medium',
        details: { query: aiQuery, error: error.message }
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
        <LiveClock variant="compact" />
      </div>
      
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="rounded-lg p-4 md:p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B0B0] text-sm">Active Users</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{systemMetrics.activeUsers}</p>
            </div>
            <Users className="h-6 w-6 md:h-8 md:w-8 text-[#FF3C3C]" />
          </div>
        </div>
        <div className="rounded-lg p-4 md:p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B0B0] text-sm">Total Alerts</p>
              <p className="text-2xl md:text-3xl font-bold text-[#FF3C3C]">{systemMetrics.totalAlerts}</p>
            </div>
            <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-[#FF3C3C]" />
          </div>
        </div>
        <div className="rounded-lg p-4 md:p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B0B0] text-sm">Resolved Incidents</p>
              <p className="text-2xl md:text-3xl font-bold text-green-400">{systemMetrics.resolvedIncidents}</p>
            </div>
            <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-400" />
          </div>
        </div>
        <div className="rounded-lg p-4 md:p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0B0B0] text-sm">Pending Actions</p>
              <p className="text-2xl md:text-3xl font-bold text-yellow-400">{systemMetrics.pendingActions}</p>
            </div>
            <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* System Health & Active Threats */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-lg p-4 md:p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-base md:text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">CPU Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 rounded-full" style={{ backgroundColor: '#0D0D0D' }}>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#FF3C3C', width: `${systemMetrics.cpuUsage}%` }}></div>
                </div>
                <span className="text-white text-sm">{systemMetrics.cpuUsage}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Memory Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 rounded-full" style={{ backgroundColor: '#0D0D0D' }}>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#FF3C3C', width: `${systemMetrics.memoryUsage}%` }}></div>
                </div>
                <span className="text-white text-sm">{systemMetrics.memoryUsage}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Storage Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 rounded-full" style={{ backgroundColor: '#0D0D0D' }}>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#FF3C3C', width: `${systemMetrics.storageUsage}%` }}></div>
                </div>
                <span className="text-white text-sm">{systemMetrics.storageUsage}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Active Threats</h3>
          <div className="space-y-3">
            {threats.map((threat) => (
              <div key={threat.id} className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    threat.severity === 'critical' ? 'bg-red-500' : 
                    threat.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="text-white text-sm font-medium">{threat.type}</p>
                    <p className="text-[#B0B0B0] text-xs">{threat.user} • {threat.time}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  threat.status === 'active' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {threat.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {/* 1. Risk Score Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          key={JSON.stringify(riskScoreData)}
        >
        <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-base md:text-lg font-semibold text-white mb-2">Risk Score Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={riskScoreData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={dimCharts ? "#2a1010" : "#FF3C3C"} stopOpacity={dimCharts ? 0.8 : 0.8}/>
                    <stop offset="95%" stopColor={dimCharts ? "#2a1010" : "#FF3C3C"} stopOpacity={dimCharts ? 0.2 : 0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#B0B0B0"/>
              <YAxis domain={[0, 100]} stroke="#B0B0B0"/>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <Tooltip contentStyle={{ background: '#1A1A1A', borderColor: dimCharts ? "#2a1010" : '#FF3C3C', color: '#fff', borderRadius: '8px', border: `1px solid ${dimCharts ? "#2a1010" : '#FF3C3C'}`, transition: 'all 0.3s' }} cursor={{ fill: 'rgba(255,60,60,0.1)' }} />
                <Area type="monotone" dataKey="score" stroke={dimCharts ? "#2a1010" : "#FF3C3C"} fillOpacity={dimCharts ? 0.85 : 1} fill="url(#colorScore)" isAnimationActive={true} animationDuration={1200} animationEasing="ease-in-out" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        </motion.div>
        {/* 2. Threat Type Occurrence */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          key={JSON.stringify(threatTypeData)}
        >
        <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-base md:text-lg font-semibold text-white mb-2">Threat Type Occurrence</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart 
              data={threatTypeData} 
              layout="vertical" 
              margin={{ top: 5, right: 10, left: 45, bottom: 5 }}
              barGap={8}
            >
              <XAxis 
                type="number" 
                stroke="#B0B0B0"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="type" 
                type="category" 
                stroke="#B0B0B0"
                width={40}
                tick={{ fontSize: 13, fill: '#B0B0B0' }}
                axisLine={false}
                tickLine={false}
              />
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#333" 
                horizontal={false}
              />
              <Tooltip 
                contentStyle={{ 
                  background: '#1A1A1A', 
                    borderColor: dimCharts ? "#2a1010" : '#FF3C3C', 
                  color: '#fff',
                  borderRadius: '8px',
                    border: `1px solid ${dimCharts ? "#2a1010" : '#FF3C3C'}`,
                    transition: 'all 0.3s'
                }}
                  cursor={{ fill: 'rgba(255,60,60,0.1)' }}
              />
              <Bar 
                dataKey="count" 
                  fill={dimCharts ? "#2a1010" : "#FF3C3C"} 
                barSize={26}
                radius={[3, 3, 3, 3]}
                background={{ fill: '#0D0D0D', radius: 3 }}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-in"
                  activeBar={{ fill: "#FF7C7C" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </motion.div>
        {/* 3. User Risk Distribution */}
        <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-base md:text-lg font-semibold text-white mb-2">User Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={userRiskData}
                dataKey="value"
                nameKey="level"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                label={false}
                labelLine={false}
              >
                {userRiskData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={riskColors[idx % riskColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#FFFFFF', 
                  borderColor: '#FF3C3C', 
                  color: '#000000',
                  borderRadius: '8px',
                  border: '2px solid #FF3C3C',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  padding: '8px 12px'
                }}
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={40} 
                iconType="circle"
                wrapperStyle={{ paddingTop: '5px' }}
                formatter={(value, entry) => {
                  const data = userRiskData.find(item => item.level === value);
                  return `${value}: ${data ? data.value : 0}%`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Update filtered users when filter type changes
  useEffect(() => {
    let filtered = users;
    if (filterType !== 'all') {
      filtered = users.filter(user => {
        if (filterType === 'active') return user.status === 'active';
        if (filterType === 'locked') return user.status === 'locked';
        if (filterType === 'high-risk') return (user.riskScore || 0) > 80;
        return true;
      });
    }
    setFilteredUsers(filtered);
  }, [users, filterType]);

  const renderUsers = () => {

    const handleBulkAction = (action: string) => {
      if (selectedUsers.length === 0) {
        alert('Please select users first');
        return;
      }

      switch (action) {
        case 'lock':
          selectedUsers.forEach(userId => {
            // Update user status to locked
            console.log('Locking user:', userId);
          });
          alert(`${selectedUsers.length} users locked successfully`);
          break;
        case 'unlock':
          selectedUsers.forEach(userId => {
            console.log('Unlocking user:', userId);
          });
          alert(`${selectedUsers.length} users unlocked successfully`);
          break;
        case 'reset-password':
          alert(`Password reset emails sent to ${selectedUsers.length} users`);
          break;
        case 'export':
          const selectedUserData = filteredUsers.filter(user => 
            selectedUsers.includes(user.id?.toString() || '')
          );
          csvManager.exportUsers(selectedUserData);
          break;
        default:
          break;
      }
      setSelectedUsers([]);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <div className="flex items-center space-x-4">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-transparent text-white"
              style={{ borderColor: '#B0B0B0' }}
            >
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="locked">Locked Only</option>
              <option value="high-risk">High Risk</option>
            </select>
            {selectedUsers.length > 0 && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Bulk Actions ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>

        {showBulkActions && selectedUsers.length > 0 && (
          <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#FF3C3C' }}>
            <h3 className="text-white font-semibold mb-3">Bulk Actions for {selectedUsers.length} users:</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleBulkAction('lock')} 
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center space-x-1"
              >
                <Lock className="h-4 w-4" />
                <span>Lock Users</span>
              </button>
              <button 
                onClick={() => handleBulkAction('unlock')} 
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Unlock Users
              </button>
              <button 
                onClick={() => handleBulkAction('reset-password')} 
                className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors flex items-center space-x-1"
              >
                <Key className="h-4 w-4" />
                <span>Reset Passwords</span>
              </button>
              <button 
                onClick={() => handleBulkAction('export')} 
                className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Export Selected</span>
              </button>
              <button 
                onClick={() => setSelectedUsers([])} 
                className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        <UserManagement 
          onUserUpdate={() => {}} 
          selectedUsers={selectedUsers}
          onUserSelect={(userId, selected) => {
            if (selected) {
              setSelectedUsers(prev => [...prev, userId]);
            } else {
              setSelectedUsers(prev => prev.filter(id => id !== userId));
            }
          }}
          showCheckboxes={true}
          filteredUsers={filteredUsers}
        />
      </div>
    );
  };

  const renderAIInsights = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">AI Insights</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Real-time AI Copilot</h3>
          <div className="space-y-4">
            <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
              <p className="text-white text-sm">💡 <strong>Ask for real-time insights:</strong></p>
              <p className="text-[#B0B0B0] text-xs mt-1">• "Who downloaded largest files today?"</p>
              <p className="text-[#B0B0B0] text-xs">• "Unusual logins in the last 24h?"</p>
              <p className="text-[#B0B0B0] text-xs">• "Users with highest risk scores?"</p>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                placeholder="Ask AI for insights..."
                className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
                style={{ borderColor: '#B0B0B0' }}
              />
              <button 
                onClick={handleAIQuery}
                disabled={isAiLoading || !aiQuery.trim()}
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
                style={{ backgroundColor: '#FF3C3C' }}
              >
                {isAiLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Brain className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
            
            {aiResponse && (
              <div className="mt-4 p-4 rounded" style={{ backgroundColor: '#0D0D0D' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#B0B0B0] text-xs">AI Response</span>
                  <button 
                    onClick={() => {
                      setAiResponse('');
                      setAiQuery('');
                    }}
                    className="text-[#B0B0B0] hover:text-white text-xs"
                  >
                    Clear
                  </button>
                </div>
                <div className="text-white text-sm whitespace-pre-line">{aiResponse}</div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
              <p className="text-white text-sm">🔒 <strong>High Risk User Detected</strong></p>
              <p className="text-[#B0B0B0] text-xs mt-1">Mike Davis shows unusual activity patterns. Consider reviewing access.</p>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
              <p className="text-white text-sm">📊 <strong>System Optimization</strong></p>
              <p className="text-[#B0B0B0] text-xs mt-1">CPU usage is high. Consider scaling resources during peak hours.</p>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
              <p className="text-white text-sm">🛡️ <strong>Security Alert</strong></p>
              <p className="text-[#B0B0B0] text-xs mt-1">Multiple failed login attempts detected from unknown IP.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPolicies = () => {
    const handleThresholdChange = (key: string, value: number) => {
      setAlertThresholds(prev => ({ ...prev, [key]: value }));
    };

    const handleQuickAction = (action: string) => {
      switch (action) {
        case 'lockAll':
          setQuickActions(prev => ({ ...prev, lockAllSessions: !prev.lockAllSessions }));
          alert(quickActions.lockAllSessions ? 'All sessions unlocked' : 'All sessions locked');
          break;
        case 'emergencyMode':
          setQuickActions(prev => ({ ...prev, enableEmergencyMode: !prev.enableEmergencyMode }));
          alert(quickActions.enableEmergencyMode ? 'Emergency mode disabled' : 'Emergency mode enabled');
          break;
        case 'pauseExports':
          setQuickActions(prev => ({ ...prev, pauseDataExports: !prev.pauseDataExports }));
          alert(quickActions.pauseDataExports ? 'Data exports resumed' : 'Data exports paused');
          break;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Policy Configuration</h1>
          <button
            onClick={() => setShowAutomationPanel(!showAutomationPanel)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Automation Rules</span>
          </button>
        </div>
        
        {/* Quick Actions Panel */}
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#FF3C3C' }}>
          <h3 className="text-lg font-semibold text-white mb-4">🚨 Emergency Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleQuickAction('lockAll')}
              className={`p-4 rounded-lg border-2 transition-all ${quickActions.lockAllSessions 
                ? 'border-red-500 bg-red-900/20 text-red-400' 
                : 'border-gray-600 hover:border-red-400 text-white hover:text-red-400'
              }`}
            >
              <Lock className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">
                {quickActions.lockAllSessions ? 'Sessions Locked' : 'Lock All Sessions'}
              </div>
            </button>
            <button
              onClick={() => handleQuickAction('emergencyMode')}
              className={`p-4 rounded-lg border-2 transition-all ${quickActions.enableEmergencyMode 
                ? 'border-orange-500 bg-orange-900/20 text-orange-400' 
                : 'border-gray-600 hover:border-orange-400 text-white hover:text-orange-400'
              }`}
            >
              <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">
                {quickActions.enableEmergencyMode ? 'Emergency Mode ON' : 'Emergency Mode'}
              </div>
            </button>
            <button
              onClick={() => handleQuickAction('pauseExports')}
              className={`p-4 rounded-lg border-2 transition-all ${quickActions.pauseDataExports 
                ? 'border-yellow-500 bg-yellow-900/20 text-yellow-400' 
                : 'border-gray-600 hover:border-yellow-400 text-white hover:text-yellow-400'
              }`}
            >
              <Database className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">
                {quickActions.pauseDataExports ? 'Exports Paused' : 'Pause Data Exports'}
              </div>
            </button>
          </div>
        </div>

        {/* Automation Rules Panel */}
        {showAutomationPanel && (
          <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
            <h3 className="text-lg font-semibold text-white mb-4">🤖 Automation Rules</h3>
            <div className="space-y-4">
              <div className="p-4 rounded border" style={{ borderColor: '#B0B0B0', backgroundColor: '#0D0D0D' }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">Auto-lock High Risk Users</h4>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <p className="text-gray-400 text-sm mb-2">Automatically lock users when risk score exceeds 90</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Trigger at risk score:</span>
                  <input type="number" defaultValue={90} className="w-16 px-2 py-1 rounded border bg-transparent text-white text-sm" />
                </div>
              </div>
              
              <div className="p-4 rounded border" style={{ borderColor: '#B0B0B0', backgroundColor: '#0D0D0D' }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">Failed Login Lockout</h4>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <p className="text-gray-400 text-sm mb-2">Lock user after multiple failed login attempts</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Max attempts:</span>
                  <input type="number" defaultValue={alertThresholds.failedLoginThreshold} className="w-16 px-2 py-1 rounded border bg-transparent text-white text-sm" />
                </div>
              </div>
              
              <div className="p-4 rounded border" style={{ borderColor: '#B0B0B0', backgroundColor: '#0D0D0D' }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">Large Data Export Alert</h4>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <p className="text-gray-400 text-sm mb-2">Send alert when data export exceeds threshold</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Threshold (MB):</span>
                  <input type="number" defaultValue={alertThresholds.dataExportThreshold} className="w-20 px-2 py-1 rounded border bg-transparent text-white text-sm" />
                </div>
              </div>
            </div>
          </div>
        )}
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
            <h3 className="text-lg font-semibold text-white mb-4">Alert Thresholds</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">CPU Usage Alert (%)</span>
                <input 
                  type="number" 
                  value={alertThresholds.cpuThreshold} 
                  onChange={(e) => handleThresholdChange('cpuThreshold', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 rounded border bg-transparent text-white" 
                  style={{ borderColor: '#B0B0B0' }} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Memory Usage Alert (%)</span>
                <input 
                  type="number" 
                  value={alertThresholds.memoryThreshold} 
                  onChange={(e) => handleThresholdChange('memoryThreshold', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 rounded border bg-transparent text-white" 
                  style={{ borderColor: '#B0B0B0' }} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Storage Alert (%)</span>
                <input 
                  type="number" 
                  value={alertThresholds.storageThreshold} 
                  onChange={(e) => handleThresholdChange('storageThreshold', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 rounded border bg-transparent text-white" 
                  style={{ borderColor: '#B0B0B0' }} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Failed Login Attempts</span>
                <input 
                  type="number" 
                  value={alertThresholds.failedLoginThreshold} 
                  onChange={(e) => handleThresholdChange('failedLoginThreshold', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 rounded border bg-transparent text-white" 
                  style={{ borderColor: '#B0B0B0' }} 
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
            <h3 className="text-lg font-semibold text-white mb-4">Data Access Policies</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white">File Download Limit</span>
                <select className="px-2 py-1 rounded border bg-transparent text-white" style={{ borderColor: '#B0B0B0' }}>
                  <option>10 MB</option>
                  <option>50 MB</option>
                  <option>100 MB</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Session Timeout</span>
                <select className="px-2 py-1 rounded border bg-transparent text-white" style={{ borderColor: '#B0B0B0' }}>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">2FA Required</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">IP Whitelist Only</span>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Device Registration Required</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        
        {/* System Performance Monitoring */}
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">📊 System Performance Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded border ${systemMetrics.cpuUsage > alertThresholds.cpuThreshold ? 'border-red-500 bg-red-900/10' : 'border-green-500 bg-green-900/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <Monitor className="h-5 w-5 text-gray-400" />
                <span className={`text-sm font-bold ${systemMetrics.cpuUsage > alertThresholds.cpuThreshold ? 'text-red-400' : 'text-green-400'}`}>
                  {systemMetrics.cpuUsage > alertThresholds.cpuThreshold ? '⚠️ HIGH' : '✅ OK'}
                </span>
              </div>
              <div className="text-white text-sm">CPU Usage: {systemMetrics.cpuUsage}%</div>
              <div className="text-xs text-gray-400 mt-1">Threshold: {alertThresholds.cpuThreshold}%</div>
            </div>
            
            <div className={`p-4 rounded border ${systemMetrics.memoryUsage > alertThresholds.memoryThreshold ? 'border-red-500 bg-red-900/10' : 'border-green-500 bg-green-900/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <HardDrive className="h-5 w-5 text-gray-400" />
                <span className={`text-sm font-bold ${systemMetrics.memoryUsage > alertThresholds.memoryThreshold ? 'text-red-400' : 'text-green-400'}`}>
                  {systemMetrics.memoryUsage > alertThresholds.memoryThreshold ? '⚠️ HIGH' : '✅ OK'}
                </span>
              </div>
              <div className="text-white text-sm">Memory: {systemMetrics.memoryUsage}%</div>
              <div className="text-xs text-gray-400 mt-1">Threshold: {alertThresholds.memoryThreshold}%</div>
            </div>
            
            <div className={`p-4 rounded border ${systemMetrics.storageUsage > alertThresholds.storageThreshold ? 'border-red-500 bg-red-900/10' : 'border-green-500 bg-green-900/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <Database className="h-5 w-5 text-gray-400" />
                <span className={`text-sm font-bold ${systemMetrics.storageUsage > alertThresholds.storageThreshold ? 'text-red-400' : 'text-green-400'}`}>
                  {systemMetrics.storageUsage > alertThresholds.storageThreshold ? '⚠️ HIGH' : '✅ OK'}
                </span>
              </div>
              <div className="text-white text-sm">Storage: {systemMetrics.storageUsage}%</div>
              <div className="text-xs text-gray-400 mt-1">Threshold: {alertThresholds.storageThreshold}%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <CSVExport onExportComplete={() => {
      // Handle export completion if needed
    }} />
  );

  const renderLogs = () => {
    // Get actual users from CSV manager
    const users = csvManager.getAllUsers();
    
    // Create mock log entries with Hindi names
    const logEntries = [
      {
        id: 1,
        user: 'Devv Saxena',
        action: 'Login',
        ipAddress: '192.168.1.101',
        device: 'MacBook Pro',
        location: 'Office',
        timestamp: timeUtils.formatForActivity(new Date(Date.now() - 2 * 60 * 60 * 1000)),
        status: 'Success'
      },
      {
        id: 2,
        user: 'Priyanshi Saxena',
        action: 'File Download',
        ipAddress: '192.168.1.102',
        device: 'Dell XPS',
        location: 'Remote',
        timestamp: timeUtils.formatForActivity(new Date(Date.now() - 1 * 60 * 60 * 1000)),
        status: 'Success'
      },
      {
        id: 3,
        user: 'Mohak',
        action: 'Login',
        ipAddress: '192.168.1.103',
        device: 'Windows PC',
        location: 'Office',
        timestamp: timeUtils.formatForActivity(new Date(Date.now() - 30 * 60 * 1000)),
        status: 'Success'
      },
      {
        id: 4,
        user: 'Tushar Suthar',
        action: 'Report Access',
        ipAddress: '192.168.1.104',
        device: 'iPad',
        location: 'Remote',
        timestamp: timeUtils.formatForActivity(new Date(Date.now() - 45 * 60 * 1000)),
        status: 'Success'
      },
      {
        id: 5,
        user: 'Riya Raut',
        action: 'Login',
        ipAddress: '192.168.1.105',
        device: 'MacBook Air',
        location: 'Office',
        timestamp: timeUtils.formatForActivity(new Date(Date.now() - 15 * 60 * 1000)),
        status: 'Success'
      },
      {
        id: 6,
        user: 'Devv Saxena',
        action: 'User Management',
        ipAddress: '192.168.1.101',
        device: 'MacBook Pro',
        location: 'Office',
        timestamp: timeUtils.formatForActivity(new Date(Date.now() - 10 * 60 * 1000)),
        status: 'Success'
      },
      {
        id: 7,
        user: 'Priyanshi Saxena',
        action: 'Security Scan',
        ipAddress: '192.168.1.102',
        device: 'Dell XPS',
        location: 'Remote',
        timestamp: timeUtils.formatForActivity(new Date(Date.now() - 5 * 60 * 1000)),
        status: 'Success'
      }
    ];

    return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Access Logs</h1>
      
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#B0B0B0' }}>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">User</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Action</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">IP Address</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Device</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Location</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Timestamp</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
                {logEntries.map((entry) => (
                  <tr key={entry.id} className="border-b" style={{ borderColor: '#B0B0B0' }}>
                    <td className="p-4 text-white">{entry.user}</td>
                    <td className="p-4 text-white">{entry.action}</td>
                    <td className="p-4 text-white">{entry.ipAddress}</td>
                    <td className="p-4 text-white">{entry.device}</td>
                    <td className="p-4 text-white">{entry.location}</td>
                    <td className="p-4 text-white">{entry.timestamp}</td>
                  <td className="p-4">
                      <span className="text-green-400 text-sm">{entry.status}</span>
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

  const renderLiveTracking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Live Tracking Dashboard</h1>
        <button
          onClick={() => setIsLiveTrackingOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Activity className="h-4 w-4" />
          <span>Open Full View</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Map */}
        <div className="rounded-lg border p-6" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <RealTimeMap 
            activities={liveActivities} 
            onUserSelect={(activity) => console.log('Selected user:', activity)}
          />
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-lg border p-6" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Live Activity Feed</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {liveActivities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="p-3 rounded border" style={{ borderColor: '#B0B0B0' }}>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{activity.username}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-1">{activity.action}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.riskLevel === 'critical' ? 'text-red-500 bg-red-900/20' :
                    activity.riskLevel === 'high' ? 'text-orange-500 bg-orange-900/20' :
                    activity.riskLevel === 'medium' ? 'text-yellow-500 bg-yellow-900/20' :
                    'text-green-500 bg-green-900/20'
                  }`}>
                    {activity.riskLevel.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-xs">{activity.deviceInfo.deviceType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Tracking Panel */}
      <LiveTrackingPanel 
        isOpen={isLiveTrackingOpen}
        onToggle={() => setIsLiveTrackingOpen(!isLiveTrackingOpen)}
      />
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">System Settings</h1>
      
      {/* Reset System Button */}
      <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <h3 className="text-lg font-semibold text-white mb-4">System Reset</h3>
        <div className="space-y-4">
          <p className="text-[#B0B0B0] text-sm">
            Reset the system to default users
          </p>
          <button
            onClick={() => {
              csvManager.resetToDefaults();
              alert('System reset to default users! You can now login with:\n\nUsername: devv\nPassword: devv123');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reset to Default Users
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Cloud Resources</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Auto-scaling</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Backup frequency</span>
              <select className="px-2 py-1 rounded border bg-transparent text-white" style={{ borderColor: '#B0B0B0' }}>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Data retention</span>
              <select className="px-2 py-1 rounded border bg-transparent text-white" style={{ borderColor: '#B0B0B0' }}>
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">AI Model Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Model sensitivity</span>
              <select className="px-2 py-1 rounded border bg-transparent text-white" style={{ borderColor: '#B0B0B0' }}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Learning rate</span>
              <input type="number" defaultValue={0.01} step="0.01" className="w-20 px-2 py-1 rounded border bg-transparent text-white" style={{ borderColor: '#B0B0B0' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Auto-update models</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 md:p-6">
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'ai-insights' && renderAIInsights()}
      {activeTab === 'policies' && renderPolicies()}
      {activeTab === 'reports' && renderReports()}
      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'live-tracking' && renderLiveTracking()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default AdminPanel; 