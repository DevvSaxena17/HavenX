import React, { useState } from 'react';
import { X, Brain, User, AlertTriangle, BarChart3, Clock, Lightbulb, Zap, Settings, MessageSquare, Send } from 'lucide-react';
import { ThreatAnalysis, UserLogEntry } from '../types/security';

interface AIInsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ThreatAnalysis;
  logs: UserLogEntry[];
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ isOpen, onClose, analysis, logs }) => {
  const [activeMode, setActiveMode] = useState<'report' | 'chat'>('report');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Add user message
    const newHistory = [...chatHistory, { type: 'user' as const, message: chatMessage }];
    
    // Generate AI response based on common queries
    let aiResponse = '';
    const lowerMessage = chatMessage.toLowerCase();
    
    if (lowerMessage.includes('riskiest user') || lowerMessage.includes('top risk')) {
      aiResponse = `The highest risk user is ${analysis.topRiskUser} with a risk score of ${analysis.topRiskScore}%. They have exhibited suspicious behavior including external access and restricted file interactions.`;
    } else if (lowerMessage.includes('summary') || lowerMessage.includes('today')) {
      aiResponse = `Today's summary: ${analysis.alertsToday} alerts triggered with an average risk score of ${analysis.averageRiskScore}%. Peak activity occurred during ${analysis.peakActivityTime}. ${analysis.aiSummary}`;
    } else if (lowerMessage.includes('prediction') || lowerMessage.includes('tomorrow')) {
      aiResponse = analysis.prediction;
    } else if (lowerMessage.includes('action') || lowerMessage.includes('recommend')) {
      aiResponse = analysis.suggestedAction;
    } else if (lowerMessage.includes('user23')) {
      const user23Logs = logs.filter(log => log.username === 'User23');
      aiResponse = `User23 has ${user23Logs.length} activities logged with risk scores ranging from ${Math.min(...user23Logs.map(l => l.risk_score))} to ${Math.max(...user23Logs.map(l => l.risk_score))}. Recent actions include restricted file access and confidential report downloads from external locations.`;
    } else {
      aiResponse = "I can help you analyze threat data, user behavior patterns, and security recommendations. Try asking about the riskiest users, today's activity summary, or specific security predictions.";
    }
    
    newHistory.push({ type: 'ai', message: aiResponse });
    setChatHistory(newHistory);
    setChatMessage('');
  };

  if (!isOpen) return null;

  return (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[10005]">
      <div className="absolute top-0 right-0 w-96 h-full bg-gray-900 border-l border-gray-700 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-400" />
              <h2 className="text-lg font-bold">HavenX AI</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveMode('report')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeMode === 'report' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Threat Report</span>
              </div>
            </button>
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeMode === 'chat' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>AI Chat</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeMode === 'report' ? (
              <div className="p-4 space-y-4 overflow-y-auto h-full">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">🧠 HavenX AI Threat Report</h3>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-red-400" />
                    <span className="text-sm font-semibold">Top Risk User</span>
                  </div>
                  <p className="text-red-400 font-bold">{analysis.topRiskUser} (Risk Score: {analysis.topRiskScore})</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-semibold">Alerts Triggered Today</span>
                  </div>
                  <p className="text-orange-400 font-bold">{analysis.alertsToday}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-semibold">Average Risk Score</span>
                  </div>
                  <p className="text-blue-400 font-bold">{analysis.averageRiskScore}%</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-semibold">Peak Activity Time</span>
                  </div>
                  <p className="text-yellow-400 font-bold">{analysis.peakActivityTime}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-semibold">AI Summary</span>
                  </div>
                  <p className="text-gray-300 text-sm">{analysis.aiSummary}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-semibold">Prediction</span>
                  </div>
                  <p className="text-gray-300 text-sm">{analysis.prediction}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-semibold">Suggested Action</span>
                  </div>
                  <p className="text-gray-300 text-sm">{analysis.suggestedAction}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                      <p className="text-sm">Ask me about threat analysis, user behavior, or security recommendations.</p>
                      <div className="mt-4 space-y-2 text-xs">
                        <p>Try: "Who is the riskiest user today?"</p>
                        <p>Try: "Summarize today's activity"</p>
                        <p>Try: "What should I do about User42?"</p>
                      </div>
                    </div>
                  ) : (
                    chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-lg ${
                          chat.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 border border-gray-700'
                        }`}>
                          <p className="text-sm">{chat.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="border-t border-gray-700 p-4">
                  <form onSubmit={handleChatSubmit} className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask HavenX AI..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;