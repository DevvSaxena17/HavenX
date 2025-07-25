import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FileText
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isCommand?: boolean;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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
        "Show system health metrics"
      ],
      analyst: [
        "What was my last login time?",
        "How can I improve my security score?",
        "Report suspicious activity",
        "Request access to sensitive data",
        "Check my activity logs"
      ],
      viewer: [
        "What was my last login time?",
        "How can I secure my device?",
        "What are the basic security rules?",
        "Contact support team"
      ]
    };

    return roleSuggestions[userRole as keyof typeof roleSuggestions] || baseSuggestions;
  };

  const suggestions = getSmartSuggestions();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      isCommand: isCommandMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, userRole);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        isCommand: isCommandMode
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (input: string, role: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (role === 'admin') {
      if (lowerInput.includes('download') || lowerInput.includes('file')) {
        return "📊 **File Download Analysis**\n\nToday's largest file downloads:\n• John Smith: 2.5GB project files (10:30 AM)\n• Sarah Johnson: 1.8GB client data (2:15 PM)\n• Mike Davis: 3.2GB financial reports (11:45 AM)\n\n⚠️ **Alert**: Mike Davis downloaded sensitive financial data outside business hours.";
      }
      if (lowerInput.includes('login') || lowerInput.includes('unusual')) {
        return "🔍 **Unusual Login Activity**\n\nSuspicious logins detected:\n• IP: 192.168.1.105 (Unknown device)\n• Time: 3:45 AM (Outside business hours)\n• User: mike.davis@company.com\n• Location: Remote (VPN detected)\n\n🚨 **Action Required**: Review and potentially block this session.";
      }
      if (lowerInput.includes('risk') || lowerInput.includes('score')) {
        return "📈 **Risk Score Analysis**\n\nTop 5 High-Risk Users:\n1. Mike Davis: 92% (Suspended)\n2. Alice Johnson: 85% (Under review)\n3. Bob Wilson: 78% (Warning sent)\n4. Carol Brown: 72% (Monitoring)\n5. David Lee: 68% (Normal)\n\n💡 **Recommendation**: Implement additional monitoring for users above 80%.";
      }
    }

    if (role === 'analyst') {
      if (lowerInput.includes('login') || lowerInput.includes('time')) {
        return "🕐 **Your Login History**\n\nRecent logins:\n• Today: 9:30 AM (Office - MacBook Pro)\n• Yesterday: 9:00 AM (Office - MacBook Pro)\n• 2 days ago: 8:45 AM (Office - MacBook Pro)\n\n✅ All logins appear normal from your usual devices.";
      }
      if (lowerInput.includes('security') || lowerInput.includes('score')) {
        return "🛡️ **Your Security Score: 85%**\n\nStrengths:\n✅ Strong password\n✅ 2FA enabled\n✅ Regular device usage\n\nImprovements:\n⚠️ Password is 30 days old\n💡 Consider changing password\n💡 Review login devices";
      }
    }

    if (role === 'viewer') {
      if (lowerInput.includes('login') || lowerInput.includes('time')) {
        return "🕐 **Your Last Login**\n\nLast login: Today, 9:00 AM\nDevice: Company Laptop\nLocation: Office\n\n✅ Login appears normal from your assigned device.";
      }
      if (lowerInput.includes('secure') || lowerInput.includes('device')) {
        return "🔒 **Device Security Tips**\n\n1. Always lock your computer when stepping away\n2. Use only company-approved devices\n3. Never share your login credentials\n4. Report any suspicious emails\n5. Keep your device updated\n\n💡 Contact support if you notice anything unusual.";
      }
    }

    return "🤖 I understand you're asking about: " + input + "\n\nI'm here to help with security-related questions. Try asking about your login history, security score, or report suspicious activity.";
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const downloadInsights = () => {
    const insights = messages
      .filter(msg => msg.type === 'ai')
      .map(msg => `${msg.timestamp.toLocaleString()}: ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([insights], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-insights-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setMessages([]);
  };

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
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={onToggle}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 md:w-96 z-50 shadow-2xl"
              style={{ backgroundColor: '#0D0D0D' }}
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
                    onClick={() => setIsCommandMode(!isCommandMode)}
                    className={`p-2 rounded transition-colors ${
                      isCommandMode ? 'bg-[#FF3C3C] text-white' : 'text-[#B0B0B0] hover:bg-[#1A1A1A]'
                    }`}
                    title={isCommandMode ? 'Switch to Natural Language' : 'Switch to Command Mode'}
                  >
                    {isCommandMode ? <Type className="h-4 w-4" /> : <Command className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={downloadInsights}
                    className="p-2 rounded text-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                    title="Download Insights"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={clearHistory}
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

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-[#B0B0B0] py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Ask me anything about security!</p>
                  </div>
                )}

                {messages.map((message) => (
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
                        onClick={() => handleSuggestionClick(suggestion)}
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
                    onClick={handleVoiceInput}
                    className={`p-2 rounded transition-colors ${
                      isListening ? 'bg-red-500 text-white' : 'text-[#B0B0B0] hover:bg-[#1A1A1A]'
                    }`}
                    title="Voice Input"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleSendMessage}
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