import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CSVManager from '../utils/csvManager';
import TimeUtils from '../utils/timeUtils';
import RealTimeDataManager from '../utils/realTimeDataManager';
import AIEnhancedManager from '../utils/aiEnhanced';
import { secureStorage, logSecurityEvent, rateLimiter } from '../utils/securityUtils';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  Send, 
  Mic, 
  MicOff, 
  Download, 
  X, 
  MessageSquare, 
  Command, 
  Type,
  ChevronLeft,
  ChevronRight,
  Settings,
  History,
  FileText,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Mail,
  Key,
  Globe,
  Monitor,
  HardDrive,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  Lock,
  Database,
  Server,
  Network,
  ShieldCheck,
  AlertCircle,
  User,
  Clock,
  MapPin,
  Smartphone,
  Activity
} from 'lucide-react';
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

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isCommand?: boolean;
  category?: string;
  confidence?: number;
}

interface AICopilotPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: string;
}

const AICopilotPanel: React.FC<AICopilotPanelProps> = ({ isOpen, onToggle, userRole }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [csvManager] = useState(() => CSVManager.getInstance());
  const [timeUtils] = useState(() => TimeUtils.getInstance());
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());
  const [aiManager] = useState(() => AIEnhancedManager.getInstance());
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Enhanced mock data
  const aiInsightsData = [
    { category: 'Security', insights: 15, critical: 3, resolved: 12 },
    { category: 'Performance', insights: 8, critical: 1, resolved: 7 },
    { category: 'Compliance', insights: 12, critical: 2, resolved: 10 },
    { category: 'User Behavior', insights: 20, critical: 5, resolved: 15 },
  ];

  const conversationStats = [
    { day: 'Mon', queries: 12, accuracy: 95 },
    { day: 'Tue', queries: 18, accuracy: 92 },
    { day: 'Wed', queries: 15, accuracy: 98 },
    { day: 'Thu', queries: 22, accuracy: 89 },
    { day: 'Fri', queries: 16, accuracy: 94 },
    { day: 'Sat', queries: 8, accuracy: 96 },
    { day: 'Sun', queries: 5, accuracy: 100 },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884D8'];

  // Smart suggestions based on user role
  const getSmartSuggestions = () => {
    const baseSuggestions = [
      "What was my last login time?",
      "How can I improve my security score?",
      "Report suspicious activity"
    ];

    const roleSuggestions = {
      admin: [
        "Who downloaded largest files today?",
        "Unusual logins in the last 24h?",
        "Users with highest risk scores?",
        "Export threat report for today",
        "Show system health metrics",
        "Analyze network traffic patterns",
        "Check compliance violations"
      ],
      analyst: [
        "What was my last login time?",
        "How can I improve my security score?",
        "Report suspicious activity",
        "Request access to sensitive data",
        "Check my activity logs",
        "Analyze my risk profile",
        "Get security recommendations"
      ],
      viewer: [
        "What was my last login time?",
        "How can I secure my device?",
        "What are the basic security rules?",
        "Contact support team",
        "Check my training progress",
        "Report a security concern"
      ]
    };

    return roleSuggestions[userRole as keyof typeof roleSuggestions] || baseSuggestions;
  };

  const suggestions = getSmartSuggestions();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Check rate limiting for copilot usage
    if (!rateLimiter.isAllowed(user?.id || 'anonymous', userRole === 'admin' ? 10 : userRole === 'analyst' ? 5 : 3, 60000)) {
      const rateLimitMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '⚠️ **Rate Limit Exceeded**\n\nToo many requests. Please wait before sending another message.',
        timestamp: new Date(),
        category: 'System',
        confidence: 100
      };
      setMessages(prev => [...prev, rateLimitMessage]);
      return;
    }

    // Log security event for AI copilot query
    logSecurityEvent({
      type: 'ai_copilot_query',
      severity: 'low',
      details: { query: inputValue, userId: user?.id, userRole, isCommand: isCommandMode }
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      isCommand: isCommandMode
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Use enhanced AI system for query processing
      const aiResult = aiManager.processNaturalLanguageQuery(currentQuery);
      
      // Simulate realistic AI processing delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
      
      // Enhance response with copilot-specific context
      let enhancedResponse = aiResult.response;
      
      // Add role-specific enhancements
      if (userRole === 'admin' && (currentQuery.toLowerCase().includes('users') || currentQuery.toLowerCase().includes('team'))) {
        const users = csvManager.getAllUsers();
        enhancedResponse += `\n\n---\n**System Users:**\n${users.map(u => `• ${u.name} (${u.role}) - Score: ${u.securityScore}`).join('\n')}`;
      }
      
      // Add behavioral insights if available
      if (currentQuery.toLowerCase().includes('behavior') || currentQuery.toLowerCase().includes('anomaly')) {
        enhancedResponse += `\n\n---\n**Behavioral Analysis:** Real-time monitoring active. No unusual patterns detected in the last 24 hours.`;
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: enhancedResponse,
        timestamp: new Date(),
        category: getMessageCategory(currentQuery),
        confidence: aiResult.confidence * 100
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
    } catch (error) {
      console.error('AI Copilot Error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '❌ **Error Processing Query**\n\nSorry, I encountered an issue processing your request. Please try again or contact support.',
        timestamp: new Date(),
        category: 'Error',
        confidence: 0
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      
      logSecurityEvent({
        type: 'ai_copilot_error',
        severity: 'medium',
        details: { query: currentQuery, error: error.message, userId: user?.id }
      });
    }
  };

  const generateAIResponse = (input: string, role: string): string => {
    const lowerInput = input.toLowerCase();
    
            if (lowerInput.includes('login') || lowerInput.includes('access')) {
          const device = role === 'admin' ? 'MacBook Pro' : role === 'analyst' ? 'Dell XPS' : 'Windows PC';
          const location = role === 'analyst' ? 'Remote' : 'Office';
          const currentTime = timeUtils.getCurrentTimeInfo();
          return `Based on your role as ${role}, here are your recent login activities:\n\n• Current time: ${currentTime.formattedTime}\n• Last login: ${timeUtils.formatForActivity(new Date(Date.now() - 2 * 60 * 60 * 1000))}\n• Device: ${device}\n• Location: ${location}\n• Status: Active\n\nAll login attempts are being monitored for security purposes.`;
        }
    
    if (lowerInput.includes('security score') || lowerInput.includes('risk')) {
      const users = csvManager.getAllUsers();
      const currentUser = users.find(u => u.role === role);
      const securityScore = currentUser?.securityScore || 85;
      
      return `Security Status for ${role}:\n\n• Security Score: ${securityScore}/100\n• Risk Level: ${securityScore >= 80 ? 'Low' : securityScore >= 60 ? 'Medium' : 'High'}\n• Last Security Scan: 1 hour ago\n• Compliance Status: ✅ Good\n\nNo immediate security concerns detected.`;
    }
    
    if (lowerInput.includes('users') || lowerInput.includes('team')) {
      const users = csvManager.getAllUsers();
      const userList = users.map(u => `• ${u.name} (${u.role})`).join('\n');
      return `Current Team Members:\n\n${userList}\n\nTotal Users: ${users.length}\nActive Users: ${users.filter(u => u.isActive).length}`;
    }
    
    if (lowerInput.includes('suspicious') || lowerInput.includes('report')) {
              return `I've logged your concern. For immediate assistance, please contact the security team at security@havenx.com or use the "Report Incident" button in your dashboard.`;
    }
    
    if (role === 'admin' && lowerInput.includes('download')) {
              return `Today's largest file downloads: 1) Priyanshi Saxena - 2.3GB security reports, 2) Mohak - 1.8GB engineering files, 3) Tushar Suthar - 950MB marketing data. All downloads were authorized.`;
    }
    
    if (role === 'admin' && lowerInput.includes('unusual')) {
      return `Unusual login activity detected: 1) Login from new IP (192.168.1.150) at 2:30 AM, 2) Multiple failed attempts from user ID 8472, 3) Access from non-corporate network. Recommend investigation.`;
    }
    
    return `Hello! I'm your AI security assistant. As a ${role}, you have access to:\n\n• Activity monitoring\n• Security reports\n• Risk assessments\n• Compliance tracking\n\nHow can I help you today?`;
  };

  const getMessageCategory = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('login') || lowerInput.includes('access')) return 'Authentication';
    if (lowerInput.includes('security') || lowerInput.includes('risk')) return 'Security';
    if (lowerInput.includes('download') || lowerInput.includes('export')) return 'Data Access';
    if (lowerInput.includes('report') || lowerInput.includes('suspicious')) return 'Incident';
    return 'General';
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const downloadInsights = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-copilot-conversation.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setMessages([]);
  };

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.category && message.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderEnhancedCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Conversation Statistics */}
      <div className="rounded-lg border p-4" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Conversation Stats</h3>
          <TrendingUp className="h-5 w-5 text-green-400" />
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={conversationStats}>
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
            />
            <Area 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#00C49F" 
              fill="#00C49F" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights Overview */}
      <div className="rounded-lg border p-4" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">AI Insights</h3>
          <Brain className="h-5 w-5 text-blue-400" />
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={aiInsightsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="category" stroke="#B0B0B0" />
            <YAxis stroke="#B0B0B0" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #B0B0B0',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Bar dataKey="insights" fill="#FF6B6B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        onClick={onToggle}
        className="fixed right-6 bottom-6 z-30 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: '#FF3C3C' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Brain className="h-6 w-6 text-white" />
      </motion.button>

      {/* AI Copilot Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[10004]"
              onClick={onToggle}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 md:w-96 z-[10005] shadow-2xl"
              style={{ backgroundColor: '#0D0D0D' }}
              onClick={(e) => e.stopPropagation()}
            >
            <div className="h-full flex flex-col border-l" style={{ borderColor: '#B0B0B0' }}>
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#B0B0B0' }}>
                <div className="flex items-center space-x-3">
                  <Brain className="h-6 w-6 text-[#FF3C3C]" />
                  <h3 className="text-white font-semibold">AI Copilot</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCommandMode(!isCommandMode);
                    }}
                    className={`p-2 rounded transition-colors ${
                      isCommandMode ? 'bg-[#FF3C3C] text-white' : 'text-[#B0B0B0] hover:bg-[#1A1A1A]'
                    }`}
                    title={isCommandMode ? 'Switch to Natural Language' : 'Switch to Command Mode'}
                  >
                    {isCommandMode ? <Type className="h-4 w-4" /> : <Command className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadInsights();
                    }}
                    className="p-2 rounded text-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                    title="Download Insights"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearHistory();
                    }}
                    className="p-2 rounded text-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                    title="Clear History"
                  >
                    <History className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onToggle}
                    className="p-2 rounded text-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Enhanced Charts Section */}
              {messages.length > 0 && (
                <div className="p-4 border-b" style={{ borderColor: '#B0B0B0' }}>
                  {renderEnhancedCharts()}
                </div>
              )}

              {/* Search and Filter */}
              {messages.length > 0 && (
                <div className="p-4 border-b" style={{ borderColor: '#B0B0B0' }}>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="Authentication">Auth</option>
                      <option value="Security">Security</option>
                      <option value="Data Access">Data</option>
                      <option value="Incident">Incident</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-[#B0B0B0] py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Ask me anything about security!</p>
                  </div>
                )}

                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-[#FF3C3C] text-white'
                          : 'bg-[#1A1A1A] text-white border'
                      }`}
                      style={{ borderColor: message.isCommand ? '#FFA500' : '#B0B0B0' }}
                    >
                      {message.isCommand && (
                        <div className="text-xs text-[#FFA500] mb-1 flex items-center">
                          <Command className="h-3 w-3 mr-1" />
                          Command Mode
                        </div>
                      )}
                      {message.category && (
                        <div className="text-xs text-blue-400 mb-1 flex items-center">
                          <span className="px-2 py-1 rounded-full bg-blue-900 text-blue-200">
                            {message.category}
                          </span>
                          {message.confidence && (
                            <span className="ml-2 text-green-400">
                              {Math.round(message.confidence)}% confidence
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#1A1A1A] text-white p-3 rounded-lg border" style={{ borderColor: '#B0B0B0' }}>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#FF3C3C] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#FF3C3C] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-[#FF3C3C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm">AI is typing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Smart Suggestions */}
              {messages.length === 0 && (
                <div className="p-4 border-t" style={{ borderColor: '#B0B0B0' }}>
                  <h4 className="text-[#B0B0B0] text-sm font-medium mb-3">Quick Questions:</h4>
                  <div className="space-y-2">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuggestionClick(suggestion);
                        }}
                        className="w-full text-left p-2 rounded text-sm text-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t" style={{ borderColor: '#B0B0B0' }}>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      onClick={(e) => e.stopPropagation()}
                      placeholder={isCommandMode ? "Enter command..." : "Ask me anything..."}
                      className="w-full px-3 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
                      style={{ borderColor: '#B0B0B0' }}
                    />
                    {isCommandMode && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Command className="h-4 w-4 text-[#FFA500]" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVoiceInput();
                    }}
                    className={`p-2 rounded transition-colors ${
                      isListening ? 'bg-red-500 text-white' : 'text-[#B0B0B0] hover:bg-[#1A1A1A]'
                    }`}
                    title="Voice Input"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessage();
                    }}
                    disabled={!inputValue.trim()}
                    className="p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: inputValue.trim() ? '#FF3C3C' : '#1A1A1A' }}
                  >
                    <Send className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AICopilotPanel; 