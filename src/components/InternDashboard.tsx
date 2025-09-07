import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
  ShieldCheck,
  BookOpen,
  Award,
  Target,
  Star,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  Coffee,
  Lightbulb,
  Layers,
  Play,
  RotateCcw
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

const InternDashboard: React.FC<{ 
  dimCharts?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}> = ({ dimCharts = false, activeTab = 'activity', onTabChange }) => {

  // Core state management
  const [aiQuery, setAiQuery] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Enhanced state for new features
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [compactView, setCompactView] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Managers and utilities
  const [csvManager] = useState(() => CSVManager.getInstance());
  const [timeUtils] = useState(() => TimeUtils.getInstance());
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());
  const [aiManager] = useState(() => AIEnhancedManager.getInstance());
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const { user, logout } = useAuth();
  
  // Animation controls
  const controls = useAnimation();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get user-specific data from CSV manager
  const currentUser = user ? csvManager.getUserByUsername(user.username) : null;
  const userActivities = currentUser ? csvManager.getUserActivities(currentUser.id) : [];
  
  // Enhanced mock data for intern with Hindi names
  const getActivityLogs = () => {
    if (!currentUser) return [];
    
    const now = new Date();
    return [
      { action: 'Logged in', time: timeUtils.formatForActivity(new Date(now.getTime() - 3 * 60 * 60 * 1000)), device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'low' },
      { action: 'Logged out', time: timeUtils.formatForActivity(new Date(now.getTime() - 19 * 60 * 60 * 1000)), device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'low' },
      { action: 'Logged in', time: timeUtils.formatForActivity(new Date(now.getTime() - 15 * 60 * 60 * 1000)), device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'low' },
      { action: 'Accessed Training Materials', time: timeUtils.formatForActivity(new Date(now.getTime() - 13.5 * 60 * 60 * 1000)), device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'low' },
      { action: 'Downloaded Manual', time: timeUtils.formatForActivity(new Date(now.getTime() - 9.75 * 60 * 60 * 1000)), device: 'Windows PC', ip: '192.168.1.103', location: 'Office', riskLevel: 'medium' },
    ];
  };

  const basicLogs = getActivityLogs();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };
  
  // Achievement system
  const checkAchievements = useCallback(() => {
    const newAchievements: string[] = [];
    
    // Check for first login achievement
    if (basicLogs.length > 0 && !achievements.includes('first-login')) {
      newAchievements.push('first-login');
    }
    
    // Check for training completion achievement
    if (basicLogs.some(log => log.action.includes('Training')) && !achievements.includes('training-started')) {
      newAchievements.push('training-started');
    }
    
    // Check for AI interaction achievement
    if (aiResponse && !achievements.includes('ai-explorer')) {
      newAchievements.push('ai-explorer');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setSuccess(`🎉 Achievement unlocked: ${newAchievements.map(a => a.replace('-', ' ')).join(', ')}!`);
      setTimeout(() => setSuccess(''), 3000);
    }
  }, [basicLogs, aiResponse, achievements]);
  
  // Auto-refresh functionality
  useEffect(() => {
    let interval: number;
    if (autoRefresh && consentGiven) {
      interval = setInterval(() => {
        setLastRefresh(new Date());
        checkAchievements();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, consentGiven, checkAchievements]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            onTabChange?.('activity');
            break;
          case '2':
            e.preventDefault();
            onTabChange?.('tips');
            break;
          case '3':
            e.preventDefault();
            onTabChange?.('ai-bot');
            break;
          case '4':
            e.preventDefault();
            onTabChange?.('helpdesk');
            break;
          case 'r':
            e.preventDefault();
            handleRefresh();
            break;
          case '?':
            e.preventDefault();
            setShowTutorial(true);
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onTabChange]);
  
  // Tutorial steps
  const tutorialSteps = [
    { title: 'Welcome to Your Dashboard', description: 'This is your personal intern dashboard where you can track your progress and stay secure.' },
    { title: 'Activity Tracking', description: 'View all your login activities and security events in the My Activity tab.' },
    { title: 'Security Tips', description: 'Learn important security practices to keep yourself and the company safe.' },
    { title: 'AI Assistant', description: 'Ask questions and get help from our AI assistant for quick answers.' },
    { title: 'Help Support', description: 'Contact our support team if you need any assistance.' }
  ];
  
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsLoading(false);
      setSuccess('Dashboard refreshed successfully!');
      setTimeout(() => setSuccess(''), 2000);
      checkAchievements();
    }, 500);
  }, [checkAchievements]);
  
  const toggleCardExpansion = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };
  
  // Quick Actions
  const quickActions = [
    { icon: RefreshCw, label: 'Refresh Data', action: handleRefresh, shortcut: 'Ctrl+R' },
    { icon: HelpCircle, label: 'Tutorial', action: () => setShowTutorial(true), shortcut: 'Ctrl+?' },
    { icon: Eye, label: 'Compact View', action: () => setCompactView(!compactView), shortcut: 'Ctrl+K' },
    { icon: Bell, label: 'Auto Refresh', action: () => setAutoRefresh(!autoRefresh), shortcut: 'Ctrl+A' }
  ];

  const securityTips = [
    {
      title: 'Strong Password Creation',
      tip: 'Use at least 12 characters with uppercase, lowercase, numbers, and symbols.',
      icon: Lock,
      priority: 'high'
    },
    {
      title: 'Email Security',
      tip: 'Never click on suspicious links or download attachments from unknown senders.',
      icon: AlertCircle,
      priority: 'high'
    },
    {
      title: 'Device Security',
      tip: 'Always lock your computer when stepping away and use company-approved devices only.',
      icon: Smartphone,
      priority: 'medium'
    },
    {
      title: 'Phishing Awareness',
      tip: 'Be cautious of emails asking for personal information or urgent action.',
      icon: Shield,
      priority: 'high'
    },
    {
      title: 'Data Handling',
      tip: 'Never share sensitive information outside of approved channels.',
      icon: Database,
      priority: 'medium'
    }
  ];

  const supportMessages = [
    { id: 1, message: 'I forgot my password', time: '1 hour ago', status: 'resolved', category: 'Authentication' },
    { id: 2, message: 'Cannot access training materials', time: '2 days ago', status: 'pending', category: 'Access Issue' },
    { id: 3, message: 'Need help with security training', time: '3 days ago', status: 'resolved', category: 'Training' },
  ];

  // Enhanced chart data
  const learningProgressData = [
    { day: 'Mon', completed: 2, total: 5, score: 75 },
    { day: 'Tue', completed: 3, total: 5, score: 80 },
    { day: 'Wed', completed: 4, total: 5, score: 85 },
    { day: 'Thu', completed: 5, total: 5, score: 90 },
    { day: 'Fri', completed: 3, total: 5, score: 88 },
    { day: 'Sat', completed: 1, total: 3, score: 92 },
    { day: 'Sun', completed: 0, total: 2, score: 95 },
  ];

  const securityAwarenessData = [
    { category: 'Password Security', score: 85, completed: true },
    { category: 'Email Security', score: 78, completed: true },
    { category: 'Device Security', score: 92, completed: true },
    { category: 'Data Protection', score: 70, completed: false },
    { category: 'Incident Reporting', score: 88, completed: true },
  ];

  const activityTimeline = [
    { type: 'login', label: 'Logged in', time: 'Mon, 9:00 AM', status: 'success' },
    { type: 'training', label: 'Completed Security Module', time: 'Mon, 10:30 AM', status: 'success' },
    { type: 'login', label: 'Logged in', time: 'Tue, 9:00 AM', status: 'success' },
    { type: 'alert', label: 'Password change reminder', time: 'Tue, 2:00 PM', status: 'warning' },
    { type: 'login', label: 'Logged in', time: 'Wed, 9:00 AM', status: 'success' },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884D8'];

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'login': return <User className="h-4 w-4 text-green-400" />;
      case 'training': return <BookOpen className="h-4 w-4 text-blue-400" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-orange-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getAchievementIcon = (achievement: string) => {
    switch (achievement) {
      case 'first-login': return <Star className="h-5 w-5 text-yellow-400" />;
      case 'training-started': return <BookOpen className="h-5 w-5 text-blue-400" />;
      case 'ai-explorer': return <Brain className="h-5 w-5 text-purple-400" />;
      default: return <Award className="h-5 w-5 text-green-400" />;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
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

  const handleConsent = () => {
    setConsentGiven(true);
  };

  const filteredBasicLogs = basicLogs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSecurityTips = securityTips.filter(tip =>
    selectedFilter === 'all' || tip.priority === selectedFilter
  );
  
  // Status and notifications
  const renderStatusBar = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-white">Online</span>
        </div>
        <div className="text-sm text-gray-300">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {achievements.length > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1 px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-400"
          >
            <Award className="h-3 w-3" />
            <span className="text-xs">{achievements.length}</span>
          </motion.div>
        )}
        <div className="flex items-center space-x-1">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className={`p-2 rounded-lg transition-colors ${
                (action.label === 'Compact View' && compactView) || 
                (action.label === 'Auto Refresh' && autoRefresh)
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={`${action.label} (${action.shortcut})`}
            >
              <action.icon className="h-4 w-4" />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
  
  // Enhanced notifications
  const renderNotifications = () => (
    <AnimatePresence>
      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
            error ? 'bg-red-900 border border-red-600' : 'bg-green-900 border border-green-600'
          }`}
        >
          <div className="flex items-center space-x-2">
            {error ? (
              <XCircle className="h-5 w-5 text-red-400" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-400" />
            )}
            <p className="text-white text-sm">{error || success}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  // Loading overlay
  const renderLoadingOverlay = () => (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-gray-800 p-6 rounded-lg border border-gray-600 text-center"
          >
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Refreshing your data...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  // Tutorial modal
  const renderTutorial = () => (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-lg border border-gray-600 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {tutorialSteps[tutorialStep]?.title}
              </h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              {tutorialSteps[tutorialStep]?.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {tutorialStep + 1} of {tutorialSteps.length}
              </div>
              <div className="space-x-2">
                {tutorialStep > 0 && (
                  <button
                    onClick={() => setTutorialStep(tutorialStep - 1)}
                    className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    Previous
                  </button>
                )}
                {tutorialStep < tutorialSteps.length - 1 ? (
                  <button
                    onClick={() => setTutorialStep(tutorialStep + 1)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-500"
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderEnhancedCharts = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid gap-6 mb-8 ${
        compactView 
          ? 'grid-cols-1 lg:grid-cols-2' 
          : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
      }`}
    >
      {/* Learning Progress */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="rounded-lg border p-6 cursor-pointer" 
        style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
        onClick={() => toggleCardExpansion('learning-progress')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white">Learning Progress</h3>
            {achievements.includes('training-started') && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-yellow-400 rounded-full"
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <motion.div
              animate={{ rotate: expandedCard === 'learning-progress' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </motion.div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={compactView ? 150 : 200}>
          <AreaChart data={learningProgressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#B0B0B0" />
            <YAxis stroke="#B0B0B0" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #B0B0B0',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
              formatter={(value, name) => [
                `${value}${name === 'score' ? '%' : ''}`, 
                name === 'score' ? 'Score' : 'Progress'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke={dimCharts ? "#102a1a" : "#00C49F"} 
              fill={dimCharts ? "#102a1a" : "#00C49F"} 
              fillOpacity={dimCharts ? 0.7 : 0.3}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
        <AnimatePresence>
          {expandedCard === 'learning-progress' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-600"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Average Score:</span>
                  <span className="text-white ml-2 font-semibold">85%</span>
                </div>
                <div>
                  <span className="text-gray-400">Trend:</span>
                  <span className="text-green-400 ml-2">↗️ Improving</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Security Awareness Radar */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="rounded-lg border p-6 cursor-pointer" 
        style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
        onClick={() => toggleCardExpansion('security-awareness')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white">Security Awareness</h3>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 bg-blue-400 rounded-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <motion.div
              animate={{ rotate: expandedCard === 'security-awareness' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </motion.div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={compactView ? 150 : 200}>
          <RadarChart data={securityAwarenessData}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="category" stroke="#B0B0B0" fontSize={12} />
            <PolarRadiusAxis stroke="#B0B0B0" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #B0B0B0',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Radar 
              name="Awareness Score" 
              dataKey="score" 
              stroke={dimCharts ? "#2a1010" : "#FF6B6B"} 
              fill={dimCharts ? "#2a1010" : "#FF6B6B"} 
              fillOpacity={dimCharts ? 0.7 : 0.3}
              animationDuration={1200}
            />
          </RadarChart>
        </ResponsiveContainer>
        <AnimatePresence>
          {expandedCard === 'security-awareness' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-600"
            >
              <div className="space-y-2">
                {securityAwarenessData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{item.category}:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{item.score}%</span>
                      {item.completed && <CheckCircle className="h-3 w-3 text-green-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress Overview */}
      <motion.div 
        variants={cardVariants}
        whileHover="hover"
        className="rounded-lg border p-6 cursor-pointer" 
        style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
        onClick={() => toggleCardExpansion('progress-overview')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white">Progress Overview</h3>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-purple-400 rounded-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <motion.div
              animate={{ rotate: expandedCard === 'progress-overview' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </motion.div>
          </div>
        </div>
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <span className="text-white">Training Completed</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-2 bg-green-400 rounded-full"
              />
            </div>
            <span className="text-white text-sm font-semibold">75%</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <span className="text-white">Security Score</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '82%' }}
                transition={{ duration: 1, delay: 0.7 }}
                className="h-2 bg-blue-400 rounded-full"
              />
            </div>
            <span className="text-white text-sm font-semibold">82%</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <span className="text-white">Compliance</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '90%' }}
                transition={{ duration: 1, delay: 0.9 }}
                className="h-2 bg-yellow-400 rounded-full"
              />
            </div>
            <span className="text-white text-sm font-semibold">90%</span>
          </motion.div>
        </div>
        <AnimatePresence>
          {expandedCard === 'progress-overview' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-600"
            >
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Next milestone:</span>
                  <span className="text-yellow-400">90% Training</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated completion:</span>
                  <span className="text-white">2 weeks</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Achievements Panel */}
      {achievements.length > 0 && (
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-lg border p-6" 
          style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
            <Award className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-2 rounded bg-yellow-900/20"
              >
                {getAchievementIcon(achievement)}
                <span className="text-white text-sm capitalize">
                  {achievement.replace('-', ' ')}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderMyActivity = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0"
      >
        <h2 className="text-xl font-bold text-white">
          My Activity {currentUser && `- ${currentUser.name}`}
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">All Activities</option>
            <option value="login">Logins</option>
            <option value="training">Training</option>
            <option value="download">Downloads</option>
          </motion.select>
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="rounded-lg border overflow-hidden" 
        style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#B0B0B0' }}>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Action</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Time</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium hidden sm:table-cell">Device</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium hidden md:table-cell">IP Address</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium hidden lg:table-cell">Location</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Risk Level</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredBasicLogs.map((log, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#2A2A2A' }}
                    className="border-b transition-colors" 
                    style={{ borderColor: '#B0B0B0' }}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="p-1 rounded bg-gray-700"
                        >
                          <Eye className="h-4 w-4 text-[#B0B0B0]" />
                        </motion.div>
                        <span className="text-white">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white text-sm">{log.time}</td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-[#B0B0B0]" />
                        <span className="text-white text-sm">{log.device}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white text-sm hidden md:table-cell">{log.ip}</td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-[#B0B0B0]" />
                        <span className="text-white text-sm">{log.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(log.riskLevel)}`}
                      >
                        {log.riskLevel.toUpperCase()}
                      </motion.span>
                    </td>
                    <td className="p-4">
                      <motion.button 
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-400 hover:text-blue-300 text-sm p-1 rounded hover:bg-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredBasicLogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">No activities found matching your search.</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );

  const renderSecurityTips = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">Security Tips</h2>
        <div className="flex items-center space-x-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tips</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSecurityTips.map((tip, index) => (
          <div key={index} className="rounded-lg p-6 border hover:bg-gray-800 transition-colors" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
              <tip.icon className="h-6 w-6 text-[#FF3C3C]" />
              <h3 className="text-lg font-semibold text-white">{tip.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(tip.priority)}`}>
                {tip.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-[#B0B0B0] text-sm">{tip.tip}</p>
          </div>
        ))}
      </div>
      
      <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <h3 className="text-lg font-semibold text-white mb-4">Important Reminders</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-white text-sm">Always use your assigned company device</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-white text-sm">Never share your login credentials</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-white text-sm">Report any suspicious emails or activities</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-white text-sm">Lock your computer when stepping away</span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    // Check rate limiting for intern users (stricter limits)
    if (!rateLimiter.isAllowed(user?.id || 'anonymous', 2, 60000)) {
      setAiResponse('⚠️ **Rate Limit Exceeded**\n\nToo many requests. Interns can ask 2 questions per minute. Please wait before asking another question.');
      return;
    }
    
    // Log security event for AI query
    logSecurityEvent({
      type: 'ai_query',
      severity: 'low',
      details: { query: aiQuery, userId: user?.id, userRole: 'intern' }
    });
    
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      // Use enhanced AI system for query processing (filtered for intern access)
      const aiResult = aiManager.processNaturalLanguageQuery(aiQuery);
      
      // Simulate AI processing delay for realism
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      
      // Add confidence score and intern-specific context to response
      const confidenceText = aiResult.confidence > 0.8 ? '🟢 High Confidence' : 
                           aiResult.confidence > 0.6 ? '🟡 Medium Confidence' : 
                           '🔴 Low Confidence';
      
      // Filter response for intern-appropriate content
      let filteredResponse = aiResult.response;
      
      // Add educational context for interns
      if (currentUser && (aiQuery.toLowerCase().includes('how') || aiQuery.toLowerCase().includes('what'))) {
        filteredResponse += `\n\n---\n**Learning Note:** As an intern, focus on understanding security basics and always ask your supervisor if you're unsure about any security procedures.`;
      }
      
      // Add intern-specific information if relevant
      if (currentUser && (aiQuery.toLowerCase().includes('my') || aiQuery.toLowerCase().includes('personal'))) {
        filteredResponse += `\n\n---\n**Your Profile:**\n• Name: ${currentUser.name}\n• Role: Intern\n• Training Progress: 75%\n• Security Score: 82/100`;
      }
      
      filteredResponse += `\n\n---\n**Analysis:** ${confidenceText} (${(aiResult.confidence * 100).toFixed(0)}%)\n**Learning Level:** Beginner-friendly response`;
      
      setAiResponse(filteredResponse);
      
    } catch (error) {
      console.error('AI Query Error:', error);
      setAiResponse('❌ **Error Processing Query**\n\nSorry, I encountered an issue processing your request. Please contact your supervisor or IT support for assistance.');
      
      logSecurityEvent({
        type: 'ai_query_error',
        severity: 'medium',
        details: { query: aiQuery, error: error instanceof Error ? error.message : String(error), userId: user?.id }
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderAIBot = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">AI Bot</h2>
      <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
              placeholder="Ask: 'What was my last login time?'"
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
                <span className="text-white font-medium">AI Assistant:</span>
              </div>
              <p className="text-white text-sm whitespace-pre-wrap">{aiResponse}</p>
            </div>
          )}
          
          <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
            <p className="text-white text-sm">💡 <strong>Available Questions:</strong></p>
            <p className="text-[#B0B0B0] text-xs mt-1">• "What was my last login time?"</p>
            <p className="text-[#B0B0B0] text-xs">• "How can I secure my device?"</p>
            <p className="text-[#B0B0B0] text-xs">• "What are the basic security rules?"</p>
            <p className="text-[#B0B0B0] text-xs">• "How do I report suspicious activity?"</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelpdesk = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-xl font-bold text-white"
      >
        Helpdesk
      </motion.h2>
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-2 rounded-lg p-6 border" 
          style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Contact Support Team</h3>
          <div className="space-y-4 mb-4" style={{ height: '300px', overflowY: 'auto' }}>
            {supportMessages.map((msg, index) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: '#FF3C3C' }}
                >
                  <User className="h-4 w-4 text-white" />
                </motion.div>
                <div className="flex-1">
                  <motion.div 
                    whileHover={{ backgroundColor: '#151515' }}
                    className="p-3 rounded transition-colors" 
                    style={{ backgroundColor: '#0D0D0D' }}
                  >
                    <p className="text-white text-sm">{msg.message}</p>
                    <p className="text-[#B0B0B0] text-xs mt-1">{msg.time}</p>
                  </motion.div>
                  <div className="mt-1">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        msg.status === 'resolved' ? 'text-green-400 bg-green-900/20' : 'text-yellow-400 bg-yellow-900/20'
                      }`}
                    >
                      {msg.status}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex space-x-2">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && supportMessage.trim() && setSupportMessage('')}
              placeholder="Type your question or issue..."
              className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C] transition-all duration-200"
              style={{ borderColor: '#B0B0B0' }}
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => supportMessage.trim() && setSupportMessage('')}
              disabled={!supportMessage.trim()}
              className="px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
              style={{ backgroundColor: '#FF3C3C' }}
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
        <motion.div 
          variants={cardVariants}
          className="rounded-lg p-6 border" 
          style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Common Issues</h3>
          <div className="space-y-3">
            {[
              { icon: Key, text: 'Forgot Password', color: 'text-red-400' },
              { icon: BookOpen, text: 'Cannot Access Training', color: 'text-blue-400' },
              { icon: Monitor, text: 'Device Issues', color: 'text-yellow-400' },
              { icon: HelpCircle, text: 'General Questions', color: 'text-green-400' }
            ].map((item, index) => (
              <motion.button 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: '#0D0D0D',
                  x: 5
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center space-x-3 p-3 rounded text-left transition-all duration-200"
              >
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-white text-sm">{item.text}</span>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="ml-auto"
                >
                  <ChevronDown className="h-3 w-3 text-gray-400 rotate-[-90deg]" />
                </motion.div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-4 md:p-6 min-h-screen relative"
    >
      {renderNotifications()}
      {renderLoadingOverlay()}
      {renderTutorial()}
      
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0"
      >
        <div className="flex items-center space-x-3">
          <motion.h1 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-2xl font-bold text-white"
          >
            Intern Dashboard
          </motion.h1>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Coffee className="h-6 w-6 text-yellow-400" />
          </motion.div>
        </div>
        <div className="flex items-center space-x-4">
          <LiveClock variant="compact" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTutorial(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <HelpCircle className="h-4 w-4 inline mr-1" />
            Help
          </motion.button>
        </div>
      </motion.div>
      
      {renderStatusBar()}
      
      {/* Activity Consent */}
      <AnimatePresence>
        {!consentGiven && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-lg p-6 border mb-6" 
            style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-2">Activity Monitoring Consent</h3>
              <p className="text-[#B0B0B0] mb-4 max-w-md mx-auto">
                Your activity on company systems is monitored for security purposes. 
                This includes login times, device information, and basic usage patterns.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConsent}
                className="px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg" 
                style={{ backgroundColor: '#FF3C3C' }}
              >
                <CheckCircle className="h-4 w-4 inline mr-2" />
                I Acknowledge and Consent
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        
      <AnimatePresence>
        {consentGiven && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {renderEnhancedCharts()}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'activity' && renderMyActivity()}
                {activeTab === 'tips' && renderSecurityTips()}
                {activeTab === 'ai-bot' && renderAIBot()}
                {activeTab === 'helpdesk' && renderHelpdesk()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InternDashboard; 