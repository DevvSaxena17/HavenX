import React, { useState } from 'react';
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
  Bell,
  Activity,
  BarChart3,
  Brain
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const EmployeeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [aiQuery, setAiQuery] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const { user, logout } = useAuth();

  // Mock data for employee
  const selfActivityLogs = [
    { action: 'Logged in', time: 'Today, 9:30 AM', device: 'MacBook Pro', ip: '192.168.1.100', location: 'Office' },
    { action: 'Accessed Project Files', time: 'Today, 10:15 AM', device: 'MacBook Pro', ip: '192.168.1.100', location: 'Office' },
    { action: 'Downloaded Report', time: 'Today, 11:45 AM', device: 'MacBook Pro', ip: '192.168.1.100', location: 'Office' },
    { action: 'Logged out', time: 'Yesterday, 5:30 PM', device: 'MacBook Pro', ip: '192.168.1.100', location: 'Office' },
    { action: 'Logged in', time: 'Yesterday, 9:00 AM', device: 'MacBook Pro', ip: '192.168.1.100', location: 'Office' },
  ];

  const notifications = [
    { type: 'info', message: 'New security policy update available', time: '2 hours ago' },
    { type: 'warning', message: 'Login detected from new device', time: '1 day ago' },
    { type: 'success', message: 'Your access request has been approved', time: '3 days ago' },
  ];

  const accessRequests = [
    { id: 1, resource: 'Financial Reports', status: 'pending', date: '2024-01-15' },
    { id: 2, resource: 'HR Database', status: 'approved', date: '2024-01-10' },
    { id: 3, resource: 'Client Data', status: 'denied', date: '2024-01-05' },
  ];

  const supportMessages = [
    { id: 1, message: 'I need help accessing the project files', time: '2 hours ago', status: 'pending' },
    { id: 2, message: 'My login is not working', time: '1 day ago', status: 'resolved' },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
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

  const handleLogout = () => {
    logout();
  };

  // Mock data for charts
  const securityScoreData = [
    { date: 'Mon', score: 78 },
    { date: 'Tue', score: 80 },
    { date: 'Wed', score: 82 },
    { date: 'Thu', score: 85 },
    { date: 'Fri', score: 83 },
    { date: 'Sat', score: 87 },
    { date: 'Sun', score: 90 },
  ];

  const activityTimeline = [
    { type: 'login', label: 'Logged in', time: 'Mon, 9:00 AM' },
    { type: 'fail', label: 'Failed login', time: 'Mon, 9:05 AM' },
    { type: 'login', label: 'Logged in', time: 'Tue, 8:55 AM' },
    { type: 'alert', label: 'Suspicious activity', time: 'Wed, 2:30 PM' },
    { type: 'login', label: 'Logged in', time: 'Thu, 9:10 AM' },
    { type: 'login', label: 'Logged in', time: 'Fri, 9:00 AM' },
    { type: 'login', label: 'Logged in', time: 'Sat, 10:00 AM' },
  ];

  const badgeProgress = 72; // percent

  // Timeline icon helper
  const getTimelineIcon = (type: string) => {
    if (type === 'login') return <CheckCircle className="h-5 w-5 text-green-400" />;
    if (type === 'fail') return <XCircle className="h-5 w-5 text-red-400" />;
    if (type === 'alert') return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    return <Activity className="h-5 w-5 text-[#B0B0B0]" />;
  };

  // Charts grid
  const renderCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
      {/* 1. Security Score Over Time */}
      <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <h3 className="text-base md:text-lg font-semibold text-white mb-2">My Security Score Over Time</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={securityScoreData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="date" stroke="#B0B0B0" />
            <YAxis domain={[0, 100]} stroke="#B0B0B0" />
            <Tooltip contentStyle={{ background: '#1A1A1A', borderColor: '#22c55e', color: '#fff' }}
              formatter={(value: any, name: any) => [`${value}%`, 'Score']} />
            <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6, fill: '#ef4444' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Login/Activity Timeline */}
      <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <h3 className="text-base md:text-lg font-semibold text-white mb-2">Login/Activity Timeline</h3>
        <div className="flex flex-col space-y-4 mt-2">
          {activityTimeline.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getTimelineIcon(item.type)}</div>
              <div>
                <div className="text-white text-sm font-medium">{item.label}</div>
                <div className="text-xs text-[#B0B0B0]">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Badge Progress */}
      <div className="rounded-lg p-4 border flex flex-col items-center justify-center" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <h3 className="text-base md:text-lg font-semibold text-white mb-2 self-start">Badge Progress</h3>
        <div className="w-32 h-32 mb-4">
          <CircularProgressbar
            value={badgeProgress}
            text={`${badgeProgress}%`}
            styles={buildStyles({
              pathColor: badgeProgress >= 80 ? '#22c55e' : badgeProgress >= 60 ? '#eab308' : '#ef4444',
              textColor: '#fff',
              trailColor: '#222',
              backgroundColor: '#1A1A1A',
              textSize: '22px',
              strokeLinecap: 'round',
            })}
          />
        </div>
        <div className="text-white text-sm font-medium">Cyber Safe Badge Progress</div>
        <div className="text-[#B0B0B0] text-xs">Earn 80%+ for your badge!</div>
      </div>
    </div>
  );

  const renderMyActivity = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">My Activity Logs</h2>
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
              </tr>
            </thead>
            <tbody>
              {selfActivityLogs.map((log, index) => (
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
                  <td className="p-4 text-white">{log.ip}</td>
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
      <h2 className="text-xl font-bold text-white">Notifications</h2>
      <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded" style={{ backgroundColor: '#0D0D0D' }}>
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <p className="text-white text-sm">{notification.message}</p>
                <p className="text-[#B0B0B0] text-xs">{notification.time}</p>
              </div>
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
              placeholder="Ask: 'Was there any login from my ID yesterday?'"
              className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
              style={{ borderColor: '#B0B0B0' }}
            />
            <button className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#FF3C3C' }}>
              <Send className="h-4 w-4" />
            </button>
          </div>
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
            <button className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#FF3C3C' }}>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]">
              <HelpCircle className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">Report Suspicious Activity</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]">
              <Upload className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">Upload Screenshot</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 rounded text-left transition-colors hover:bg-[#0D0D0D]">
              <FileText className="h-4 w-4 text-[#B0B0B0]" />
              <span className="text-white text-sm">Request Access</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 md:p-6">
      {renderCharts()}
      {activeTab === 'activity' && renderMyActivity()}
      {activeTab === 'security' && renderSecurityScore()}
      {activeTab === 'notifications' && renderNotifications()}
      {activeTab === 'ai-assistant' && renderAIAssistant()}
      {activeTab === 'support' && renderSupport()}
    </div>
  );
};

export default EmployeeDashboard; 