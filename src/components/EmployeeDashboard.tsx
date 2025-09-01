import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  User, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  Eye, 
  Smartphone, 
  MapPin,
  TrendingUp,
  HelpCircle,
  Send,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Bell,
  Activity,
  BarChart3,
  Brain,
  Search,
  Filter,
  MoreVertical,
  Download,
  Calendar,
  Mail,
  Key,
  Globe,
  Monitor,
  HardDrive,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  Lock,
  Database,
  Server,
  Network,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CSVManager from '../utils/csvManager';
import TimeUtils from '../utils/timeUtils';
import RealTimeDataManager from '../utils/realTimeDataManager';
import AIEnhancedManager from '../utils/aiEnhanced';
import { secureStorage, logSecurityEvent, rateLimiter } from '../utils/securityUtils';
import LiveClock from './LiveClock';
// Enhanced Recharts imports
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
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeeDashboard: React.FC<{ 
  dimCharts?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}> = ({ dimCharts = false, activeTab = 'activity', onTabChange }) => {
  // Enhanced State Management
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState('');
  const [quickActions, setQuickActions] = useState({ favorites: [], recent: [] });
  const [userPreferences, setUserPreferences] = useState({
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    compactView: false
  });
  const [realTimeData, setRealTimeData] = useState({
    loginAttempts: 0,
    lastActivity: new Date(),
    deviceStatus: 'secure',
    networkStatus: 'connected'
  });
  
  // Utility Instances
  const [csvManager] = useState(() => CSVManager.getInstance());
  const [timeUtils] = useState(() => TimeUtils.getInstance());
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());
  const [aiManager] = useState(() => AIEnhancedManager.getInstance());
  const { user, logout } = useAuth();
  
  // Refs for animations and interactions
  const activityLogRef = useRef(null);
  const chartContainerRef = useRef(null);

  // Get user-specific data from CSV manager
  const currentUser = user ? csvManager.getUserByUsername(user.username) : null;
  const userActivities = currentUser ? csvManager.getUserActivities(currentUser.id) : [];
  
  // Real-time updates effect
  useEffect(() => {
    const updateRealTimeData = () => {
      setRealTimeData(prev => ({
        ...prev,
        lastActivity: new Date(),
        loginAttempts: Math.floor(Math.random() * 3),
        deviceStatus: Math.random() > 0.1 ? 'secure' : 'warning',
        networkStatus: Math.random() > 0.05 ? 'connected' : 'unstable'
      }));
    };
    
    const interval = userPreferences.autoRefresh ? 
      setInterval(updateRealTimeData, 30000) : null;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [userPreferences.autoRefresh]);
  
  // Auto-hide success/error messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
          case 'n':
            e.preventDefault();
            if (onTabChange) onTabChange('notifications');
            break;
          case 'a':
            e.preventDefault();
            if (onTabChange) onTabChange('activity');
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onTabChange]);

  // Enhanced mock data for employee with Hindi names
  const getActivityLogs = () => {
    if (!currentUser) return [];
    
    const now = new Date();
    const baseLogs = [
      { action: 'Logged in', time: timeUtils.formatForActivity(new Date(now.getTime() - 2.5 * 60 * 60 * 1000)), device: 'Dell XPS', ip: '192.168.1.102', location: 'Remote', riskLevel: 'low' },
      { action: 'Accessed Security Reports', time: timeUtils.formatForActivity(new Date(now.getTime() - 1.75 * 60 * 60 * 1000)), device: 'Dell XPS', ip: '192.168.1.102', location: 'Remote', riskLevel: 'low' },
      { action: 'Downloaded Threat Analysis', time: timeUtils.formatForActivity(new Date(now.getTime() - 0.25 * 60 * 60 * 1000)), device: 'Dell XPS', ip: '192.168.1.102', location: 'Remote', riskLevel: 'medium' },
      { action: 'Logged out', time: timeUtils.formatForActivity(new Date(now.getTime() - 18.5 * 60 * 60 * 1000)), device: 'Dell XPS', ip: '192.168.1.102', location: 'Remote', riskLevel: 'low' },
      { action: 'Logged in', time: timeUtils.formatForActivity(new Date(now.getTime() - 15 * 60 * 60 * 1000)), device: 'Dell XPS', ip: '192.168.1.102', location: 'Remote', riskLevel: 'low' },
      { action: 'Accessed Security Database', time: timeUtils.formatForActivity(new Date(now.getTime() - 9.5 * 60 * 60 * 1000)), device: 'Dell XPS', ip: '192.168.1.102', location: 'Remote', riskLevel: 'high' },
      { action: 'Exported Security Data', time: timeUtils.formatForActivity(new Date(now.getTime() - 8.75 * 60 * 60 * 1000)), device: 'Dell XPS', ip: '192.168.1.102', location: 'Remote', riskLevel: 'high' },
    ];

    // Customize based on user role
    if (currentUser.role === 'analyst') {
      return baseLogs;
    } else if (currentUser.role === 'viewer') {
      return [
        { action: 'Logged in', time: 'Today, 9:00 AM', device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'low' },
        { action: 'Accessed Project Files', time: 'Today, 10:00 AM', device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'low' },
        { action: 'Downloaded Report', time: 'Today, 11:30 AM', device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'medium' },
        { action: 'Logged out', time: 'Yesterday, 5:00 PM', device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'low' },
        { action: 'Logged in', time: 'Yesterday, 9:00 AM', device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'low' },
        { action: 'Accessed Training Materials', time: 'Yesterday, 2:00 PM', device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'low' },
        { action: 'Downloaded Manual', time: 'Yesterday, 3:00 PM', device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'medium' },
      ];
    }
    
    return baseLogs;
  };

  const selfActivityLogs = getActivityLogs();

  const notifications = [
    { type: 'info', message: 'New security policy update available', time: '2 hours ago', priority: 'medium' },
    { type: 'warning', message: 'Login detected from new device', time: '1 day ago', priority: 'high' },
    { type: 'success', message: 'Your access request has been approved', time: '3 days ago', priority: 'low' },
    { type: 'error', message: 'Failed login attempt detected', time: '4 days ago', priority: 'high' },
    { type: 'info', message: 'System maintenance scheduled for tonight', time: '5 days ago', priority: 'medium' },
  ];

  const accessRequests = [
    { id: 1, resource: 'Financial Reports', status: 'pending', date: '2024-01-15', priority: 'high', description: 'Need access for quarterly analysis' },
    { id: 2, resource: 'HR Database', status: 'approved', date: '2024-01-10', priority: 'medium', description: 'Employee data access for reporting' },
    { id: 3, resource: 'Client Data', status: 'denied', date: '2024-01-05', priority: 'high', description: 'Client information for project work' },
    { id: 4, resource: 'System Logs', status: 'pending', date: '2024-01-20', priority: 'low', description: 'Debug access for troubleshooting' },
  ];

  const supportMessages = [
    { id: 1, message: 'I need help accessing the project files', time: '2 hours ago', status: 'pending', category: 'Access Issue' },
    { id: 2, message: 'My login is not working', time: '1 day ago', status: 'resolved', category: 'Authentication' },
    { id: 3, message: 'Cannot download large files', time: '3 days ago', status: 'pending', category: 'System Issue' },
  ];

  // Enhanced chart data
  const securityScoreData = [
    { date: 'Mon', score: 78, threats: 2, incidents: 0 },
    { date: 'Tue', score: 80, threats: 1, incidents: 0 },
    { date: 'Wed', score: 82, threats: 0, incidents: 0 },
    { date: 'Thu', score: 85, threats: 1, incidents: 1 },
    { date: 'Fri', score: 83, threats: 3, incidents: 0 },
    { date: 'Sat', score: 87, threats: 0, incidents: 0 },
    { date: 'Sun', score: 90, threats: 0, incidents: 0 },
  ];

  const activityTimeline = [
    { type: 'login', label: 'Logged in', time: 'Mon, 9:00 AM', status: 'success' },
    { type: 'fail', label: 'Failed login', time: 'Mon, 9:05 AM', status: 'error' },
    { type: 'login', label: 'Logged in', time: 'Tue, 8:55 AM', status: 'success' },
    { type: 'alert', label: 'Suspicious activity', time: 'Wed, 2:30 PM', status: 'warning' },
    { type: 'login', label: 'Logged in', time: 'Thu, 9:10 AM', status: 'success' },
    { type: 'login', label: 'Logged in', time: 'Fri, 9:00 AM', status: 'success' },
  ];

  // New enhanced data
  const securityMetrics = {
    overallScore: 85,
    passwordStrength: 92,
    deviceSecurity: 78,
    networkSecurity: 88,
    dataProtection: 82,
    complianceScore: 90
  };

  const riskAnalysis = [
    { category: 'Authentication', score: 85, risk: 'low' },
    { category: 'Data Access', score: 72, risk: 'medium' },
    { category: 'Network', score: 88, risk: 'low' },
    { category: 'Device', score: 78, risk: 'medium' },
    { category: 'Compliance', score: 90, risk: 'low' },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884D8'];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <FileText className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'denied': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    // Check rate limiting for employee users
    if (!rateLimiter.isAllowed(user?.id || 'anonymous', 3, 60000)) {
      setAiResponse('⚠️ **Rate Limit Exceeded**\n\nToo many requests. Please wait before asking another question.');
      return;
    }
    
    // Log security event for AI query
    logSecurityEvent({
      type: 'ai_query',
      severity: 'low',
      details: { query: aiQuery, userId: user?.id, userRole: user?.role }
    });
    
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      // Use enhanced AI system for query processing
      const aiResult = aiManager.processNaturalLanguageQuery(aiQuery);
      
      // Simulate AI processing delay for realism
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      
      // Add confidence score and employee-specific context to response
      const confidenceText = aiResult.confidence > 0.8 ? '🟢 High Confidence' : 
                           aiResult.confidence > 0.6 ? '🟡 Medium Confidence' : 
                           '🔴 Low Confidence';
      
      // Customize response for employee users
      let enhancedResponse = `${aiResult.response}`;
      
      // Add employee-specific information if relevant
      if (currentUser && (aiQuery.toLowerCase().includes('my') || aiQuery.toLowerCase().includes('personal'))) {
        enhancedResponse += `\n\n---\n**Your Profile:**\n• Name: ${currentUser.name}\n• Role: ${currentUser.role}\n• Department: ${currentUser.department}\n• Security Score: ${currentUser.securityScore || 85}/100`;
      }
      
      enhancedResponse += `\n\n---\n**Analysis:** ${confidenceText} (${(aiResult.confidence * 100).toFixed(0)}%)\n**Intent:** ${aiResult.intent.replace('_', ' ').toUpperCase()}\n${aiResult.entities.length > 0 ? `**Entities:** ${aiResult.entities.join(', ')}` : ''}`;
      
      setAiResponse(enhancedResponse);
      
    } catch (error) {
      console.error('AI Query Error:', error);
      setAiResponse('❌ **Error Processing Query**\n\nSorry, I encountered an issue processing your request. Please try again or contact support if the issue persists.');
      
      logSecurityEvent({
        type: 'ai_query_error',
        severity: 'medium',
        details: { query: aiQuery, error: error.message, userId: user?.id }
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSupportMessage = () => {
    if (!supportMessage.trim()) return;
    
    // Add new message to support messages
    const newMessage = {
      id: Date.now(),
      message: supportMessage,
      time: 'Just now',
      status: 'pending' as const,
      category: 'General'
    };
    
    // In a real app, this would be sent to the backend
    console.log('Support message sent:', newMessage);
    
    // Clear input
    setSupportMessage('');
    
    // Show success message (you could add a toast notification here)
    alert('Support message sent successfully!');
  };

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

  const filteredActivityLogs = selfActivityLogs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotifications = notifications.filter(notification =>
    selectedFilter === 'all' || notification.type === selectedFilter
  );

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'login': return <User className="h-4 w-4 text-green-400" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      default: return <Activity className="h-4 w-4 text-blue-400" />;
    }
  };

  const renderEnhancedCharts = () => (
    <motion.div 
      ref={chartContainerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
    >
      {/* Real-time Status Cards */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-lg border p-6 hover:shadow-lg transition-all duration-300" 
        style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
        onMouseEnter={() => setShowTooltip('realtime')}
        onMouseLeave={() => setShowTooltip('')}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Real-time Status</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              realTimeData.deviceStatus === 'secure' ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
            <Activity className="h-5 w-5 text-blue-400" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Device Status</span>
            <span className={`text-sm font-medium ${
              realTimeData.deviceStatus === 'secure' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {realTimeData.deviceStatus.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Network</span>
            <span className={`text-sm font-medium ${
              realTimeData.networkStatus === 'connected' ? 'text-green-400' : 'text-red-400'
            }`}>
              {realTimeData.networkStatus.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Last Update</span>
            <span className="text-sm text-white">
              {realTimeData.lastActivity.toLocaleTimeString()}
            </span>
          </div>
        </div>
        {showTooltip === 'realtime' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-10 mt-2 p-2 bg-black text-white text-xs rounded shadow-lg"
          >
            Live system status updates every 30 seconds
          </motion.div>
        )}
      </motion.div>
      
      {/* Security Score Trend */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg border p-6 hover:shadow-lg transition-all duration-300" 
        style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Security Score Trend</h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <button 
              onClick={() => setSuccessMessage('Chart refreshed successfully!')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Activity className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={securityScoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#B0B0B0" />
            <YAxis stroke="#B0B0B0" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #B0B0B0',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke={dimCharts ? "#102a1a" : "#00C49F"} 
              fill={dimCharts ? "#102a1a" : "#00C49F"} 
              fillOpacity={dimCharts ? 0.7 : 0.3}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Risk Analysis Radar */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-lg border p-6 hover:shadow-lg transition-all duration-300" 
        style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Risk Analysis</h3>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">
              Low Risk
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={riskAnalysis}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="category" stroke="#B0B0B0" />
            <PolarRadiusAxis stroke="#B0B0B0" />
            <Radar 
              name="Risk Score" 
              dataKey="score" 
              stroke={dimCharts ? "#2a1010" : "#FF6B6B"} 
              fill={dimCharts ? "#2a1010" : "#FF6B6B"} 
              fillOpacity={dimCharts ? 0.7 : 0.3}
              isAnimationActive={true}
              animationDuration={2000}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Enhanced Security Metrics */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-lg border p-6 hover:shadow-lg transition-all duration-300" 
        style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Security Metrics</h3>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSuccessMessage('Security metrics updated!')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Activity className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        <div className="space-y-4">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between"
          >
            <span className="text-white">Overall Score</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-2 bg-green-400 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${securityMetrics.overallScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              ></motion.div>
            </div>
            <span className="text-white text-sm font-semibold">{securityMetrics.overallScore}%</span>
          </motion.div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between"
          >
            <span className="text-white">Password Strength</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-2 bg-blue-400 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${securityMetrics.passwordStrength}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              ></motion.div>
            </div>
            <span className="text-white text-sm font-semibold">{securityMetrics.passwordStrength}%</span>
          </motion.div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between"
          >
            <span className="text-white">Device Security</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-2 bg-yellow-400 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${securityMetrics.deviceSecurity}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              ></motion.div>
            </div>
            <span className="text-white text-sm font-semibold">{securityMetrics.deviceSecurity}%</span>
          </motion.div>
          {/* Quick Action Buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex space-x-2 mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSuccessMessage('Detailed security report generated!')}
              className="flex-1 py-2 px-3 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              View Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSuccessMessage('Security scan initiated!')}
              className="flex-1 py-2 px-3 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
            >
              Run Scan
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Quick Actions Panel */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-lg border p-6 hover:shadow-lg transition-all duration-300" 
        style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <Key className="h-5 w-5 text-orange-400" />
        </div>
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => alert('Password change initiated! Check your email for instructions.')}
            className="w-full flex items-center space-x-3 p-3 rounded bg-gray-800 hover:bg-gray-700 text-left transition-colors"
          >
            <Key className="h-4 w-4 text-yellow-400" />
            <span className="text-white text-sm">Change Password</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => alert('2FA setup opened! Follow the instructions to enable.')}
            className="w-full flex items-center space-x-3 p-3 rounded bg-gray-800 hover:bg-gray-700 text-left transition-colors"
          >
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-white text-sm">Setup 2FA</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSuccessMessage('Security checkup completed successfully!')}
            className="w-full flex items-center space-x-3 p-3 rounded bg-gray-800 hover:bg-gray-700 text-left transition-colors"
          >
            <CheckCircle className="h-4 w-4 text-blue-400" />
            <span className="text-white text-sm">Security Checkup</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderMyActivity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          My Activity Logs {currentUser && `- ${currentUser.name}`}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="search-input"
              type="text"
              placeholder="Search activities... (Ctrl+K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Activities</option>
            <option value="login">Logins</option>
            <option value="download">Downloads</option>
            <option value="access">Data Access</option>
          </select>
        </div>
      </div>
      
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#B0B0B0' }}>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Action</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Time</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Device</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">IP Address</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Location</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Risk Level</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivityLogs.map((log, index) => (
                <tr key={index} className="border-b hover:bg-gray-800 transition-colors" style={{ borderColor: '#B0B0B0' }}>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-[#B0B0B0]" />
                      <span className="text-white">{log.action}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white">{log.time}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-[#B0B0B0]" />
                      <span className="text-white">{log.device}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white">{log.ip}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-[#B0B0B0]" />
                      <span className="text-white">{log.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(log.riskLevel)}`}>
                      {log.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSecurityScore = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Security Score & Recommendations</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Your Security Score</h3>
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto rounded-full border-8 flex items-center justify-center" style={{ borderColor: '#FF3C3C' }}>
              <span className="text-3xl font-bold text-white">85%</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Password Strength</span>
              <span className="text-green-400">Strong</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">2FA Enabled</span>
              <span className="text-green-400">Yes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Last Password Change</span>
              <span className="text-yellow-400">30 days ago</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Security Recommendations</h3>
          <div className="space-y-4">
            <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
              <p className="text-white text-sm">🔒 <strong>Change your password</strong></p>
              <p className="text-[#B0B0B0] text-xs mt-1">Your password is 30 days old. Consider updating it for better security.</p>
              <button 
                onClick={() => alert('Password change request submitted! You will receive a reset link via email.')}
                className="mt-2 px-3 py-1 text-xs bg-[#FF3C3C] text-white rounded hover:bg-[#e22c2c] transition-colors"
              >
                Change Password
              </button>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
              <p className="text-white text-sm">📱 <strong>Review login devices</strong></p>
              <p className="text-[#B0B0B0] text-xs mt-1">You're logged in from 1 device. Review and remove any unknown devices.</p>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
              <p className="text-white text-sm">🔔 <strong>Enable notifications</strong></p>
              <p className="text-[#B0B0B0] text-xs mt-1">Get notified about suspicious login attempts and security updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">Notifications</h2>
        <div className="flex items-center space-x-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="warning">Warnings</option>
            <option value="success">Success</option>
            <option value="error">Errors</option>
          </select>
          <button 
            onClick={() => setSelectedFilter('all')}
            className="px-3 py-1 text-xs bg-[#FF3C3C] text-white rounded hover:bg-[#e22c2c] transition-colors"
          >
            Clear Filter
          </button>
        </div>
      </div>
      <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800 transition-colors" style={{ backgroundColor: '#0D0D0D' }}>
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                <p className="text-white text-sm">{notification.message}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    notification.priority === 'high' ? 'text-red-400' : 
                    notification.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {notification.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-[#B0B0B0] text-xs">{notification.time}</p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAIAssistant = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">AI Assistant</h2>
      <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
              placeholder="Ask: 'Was there any login from my ID yesterday?'"
              className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
              style={{ borderColor: '#B0B0B0' }}
            />
            <button 
              onClick={handleAIQuery}
              disabled={!aiQuery.trim() || isAiLoading}
              className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              style={{ backgroundColor: '#FF3C3C' }}
            >
              {isAiLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {/* AI Response */}
          {aiResponse && (
            <div className="p-4 rounded border" style={{ backgroundColor: '#0D0D0D', borderColor: '#B0B0B0' }}>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">AI Response:</span>
              </div>
              <p className="text-white text-sm whitespace-pre-wrap">{aiResponse}</p>
            </div>
          )}
          
          <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
            <p className="text-white text-sm">💡 <strong>Quick Questions:</strong></p>
            <p className="text-[#B0B0B0] text-xs mt-1">• "How can I improve my risk score?"</p>
            <p className="text-[#B0B0B0] text-xs">• "What was my last login time?"</p>
            <p className="text-[#B0B0B0] text-xs">• "Report suspicious activity"</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Support Chat</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Chat with Support Team</h3>
          <div className="space-y-4 mb-4" style={{ height: '400px', overflowY: 'auto' }}>
            {supportMessages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF3C3C' }}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
                    <p className="text-white text-sm">{msg.message}</p>
                    <p className="text-[#B0B0B0] text-xs mt-1">{msg.time}</p>
                  </div>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      msg.status === 'resolved' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
              style={{ borderColor: '#B0B0B0' }}
            />
            <button 
              onClick={handleSupportMessage}
              disabled={!supportMessage.trim()}
              className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              style={{ backgroundColor: '#FF3C3C' }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => alert('Suspicious activity report submitted! Security team will review this immediately.')}
              className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]"
            >
              <HelpCircle className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">Report Suspicious Activity</span>
            </button>
            <button 
              onClick={() => alert('Screenshot upload feature coming soon! For now, please contact support directly.')}
              className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]"
            >
              <Upload className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">Upload Screenshot</span>
            </button>
            <button 
              onClick={() => alert('Access request submitted! You will receive a response within 24 hours.')}
              className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]"
            >
              <FileText className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">Request Access</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full p-4 md:p-6"
    >
      {/* Header with enhanced features */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Employee Dashboard</h1>
          {currentUser && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-800 rounded-full"
            >
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-white">{currentUser.name}</span>
              <span className="text-xs text-gray-400">({currentUser.role})</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* Preferences Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setUserPreferences(prev => ({ ...prev, compactView: !prev.compactView }))}
            className={`p-2 rounded transition-colors ${
              userPreferences.compactView ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
            title="Toggle compact view"
          >
            <BarChart3 className="h-4 w-4" />
          </motion.button>
          
          {/* Auto-refresh Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setUserPreferences(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
            className={`p-2 rounded transition-colors ${
              userPreferences.autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
            title="Toggle auto-refresh"
          >
            <Activity className="h-4 w-4" />
          </motion.button>
          
          <LiveClock variant="compact" />
        </div>
      </motion.div>
      
      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-green-900/20 border border-green-600 rounded-lg flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm">{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage('')}
              className="ml-auto text-green-400 hover:text-green-300"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-red-900/20 border border-red-600 rounded-lg flex items-center space-x-2"
          >
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Charts - Always visible */}
      {renderEnhancedCharts()}
      
      {/* Main Content - Based on sidebar navigation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'activity' && renderMyActivity()}
          {activeTab === 'security' && renderSecurityScore()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'ai-assistant' && renderAIAssistant()}
          {activeTab === 'support' && renderSupport()}
        </motion.div>
      </AnimatePresence>
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmployeeDashboard; 