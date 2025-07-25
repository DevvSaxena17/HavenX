import React, { useState } from 'react';
import { 
  Shield, 
  User, 
  Clock, 
  MessageSquare, 
  LogOut, 
  Eye, 
  Smartphone, 
  MapPin,
  HelpCircle,
  Send,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Lock,
  Activity,
  Brain,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const InternDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [aiQuery, setAiQuery] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const { user, logout } = useAuth();

  // Mock data for intern
  const basicLogs = [
    { action: 'Logged in', time: 'Today, 9:00 AM', device: 'Company Laptop', ip: '192.168.1.101', location: 'Office' },
    { action: 'Logged out', time: 'Yesterday, 5:00 PM', device: 'Company Laptop', ip: '192.168.1.101', location: 'Office' },
    { action: 'Logged in', time: 'Yesterday, 9:00 AM', device: 'Company Laptop', ip: '192.168.1.101', location: 'Office' },
  ];

  const securityTips = [
    {
      title: 'Strong Password Creation',
      tip: 'Use at least 12 characters with uppercase, lowercase, numbers, and symbols.',
      icon: Lock
    },
    {
      title: 'Email Security',
      tip: 'Never click on suspicious links or download attachments from unknown senders.',
      icon: AlertCircle
    },
    {
      title: 'Device Security',
      tip: 'Always lock your computer when stepping away and use company-approved devices only.',
      icon: Smartphone
    },
    {
      title: 'Phishing Awareness',
      tip: 'Be cautious of emails asking for personal information or urgent action.',
      icon: Shield
    }
  ];

  const supportMessages = [
    { id: 1, message: 'I forgot my password', time: '1 hour ago', status: 'resolved' },
    { id: 2, message: 'Cannot access training materials', time: '2 days ago', status: 'pending' },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleConsent = () => {
    setConsentGiven(true);
  };

  const renderMyActivity = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">My Activity</h2>
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#B0B0B0' }}>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Action</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Time</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Device</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Location</th>
              </tr>
            </thead>
            <tbody>
              {basicLogs.map((log, index) => (
                <tr key={index} className="border-b" style={{ borderColor: '#B0B0B0' }}>
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
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-[#B0B0B0]" />
                      <span className="text-white">{log.location}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSecurityTips = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Security Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securityTips.map((tip, index) => (
          <div key={index} className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
            <div className="flex items-center space-x-3 mb-4">
              <tip.icon className="h-6 w-6 text-[#FF3C3C]" />
              <h3 className="text-lg font-semibold text-white">{tip.title}</h3>
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
              placeholder="Ask: 'What was my last login time?'"
              className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
              style={{ borderColor: '#B0B0B0' }}
            />
            <button className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#FF3C3C' }}>
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
            <p className="text-white text-sm">💡 <strong>Available Questions:</strong></p>
            <p className="text-[#B0B0B0] text-xs mt-1">• "What was my last login time?"</p>
            <p className="text-[#B0B0B0] text-xs">• "How can I secure my device?"</p>
            <p className="text-[#B0B0B0] text-xs">• "What are the basic security rules?"</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelpdesk = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Helpdesk</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Support Team</h3>
          <div className="space-y-4 mb-4" style={{ height: '300px', overflowY: 'auto' }}>
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
              placeholder="Type your question or issue..."
              className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
              style={{ borderColor: '#B0B0B0' }}
            />
            <button className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#FF3C3C' }}>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Common Issues</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]">
              <HelpCircle className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">Forgot Password</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]">
              <HelpCircle className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">Cannot Access Training</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]">
              <HelpCircle className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">Device Issues</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]">
              <HelpCircle className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">General Questions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white flex" style={{ backgroundColor: '#0D0D0D' }}>
      {/* Left Sidebar */}
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
                Intern • {user.username}
              </div>
            </div>
          )}
          
          <nav className="space-y-2 mb-6">
            {[
              { id: 'activity', label: 'My Activity', icon: Activity },
              { id: 'tips', label: 'Security Tips', icon: BookOpen },
              { id: 'ai-bot', label: 'AI Bot', icon: Brain },
              { id: 'helpdesk', label: 'Helpdesk', icon: MessageSquare },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === id 
                    ? 'text-white' 
                    : 'text-[#B0B0B0] hover:bg-[#1A1A1A]'
                }`}
                style={{ 
                  backgroundColor: activeTab === id ? '#FF3C3C' : 'transparent'
                }}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-[#B0B0B0] hover:bg-[#1A1A1A] hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6" style={{ width: '80%' }}>
        {/* Activity Consent */}
        {!consentGiven && (
          <div className="rounded-lg p-6 border mb-6" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Activity Monitoring Consent</h3>
              <p className="text-[#B0B0B0] mb-4">
                Your activity on company systems is monitored for security purposes. 
                This includes login times, device information, and basic usage patterns.
              </p>
              <button
                onClick={handleConsent}
                className="px-6 py-2 rounded-lg" style={{ backgroundColor: '#FF3C3C' }}
              >
                I Acknowledge and Consent
              </button>
            </div>
          </div>
        )}
        
        {consentGiven && (
          <>
            {activeTab === 'activity' && renderMyActivity()}
            {activeTab === 'tips' && renderSecurityTips()}
            {activeTab === 'ai-bot' && renderAIBot()}
            {activeTab === 'helpdesk' && renderHelpdesk()}
          </>
        )}
      </main>
    </div>
  );
};

export default InternDashboard; 