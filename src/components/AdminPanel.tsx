import React, { useState } from 'react';
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

interface AdminPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ activeTab, onTabChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();

  // Mock data
  const employees = [
    { id: 1, name: 'John Smith', role: 'Developer', department: 'Engineering', riskScore: 85, status: 'active', lastLogin: '2 hours ago', location: 'Office' },
    { id: 2, name: 'Sarah Johnson', role: 'HR Manager', department: 'Human Resources', riskScore: 45, status: 'active', lastLogin: '1 hour ago', location: 'Remote' },
    { id: 3, name: 'Mike Davis', role: 'Finance Analyst', department: 'Finance', riskScore: 92, status: 'suspended', lastLogin: '3 days ago', location: 'Office' },
    { id: 4, name: 'Emily Wilson', role: 'Marketing Specialist', department: 'Marketing', riskScore: 30, status: 'active', lastLogin: '30 minutes ago', location: 'Office' },
    { id: 5, name: 'David Brown', role: 'System Admin', department: 'IT', riskScore: 78, status: 'active', lastLogin: '5 minutes ago', location: 'Office' },
  ];

  const threats = [
    { id: 1, type: 'Suspicious Login', severity: 'high', user: 'Mike Davis', time: '2 hours ago', status: 'active' },
    { id: 2, type: 'Data Export', severity: 'medium', user: 'John Smith', time: '4 hours ago', status: 'resolved' },
    { id: 3, type: 'Unauthorized Access', severity: 'critical', user: 'Unknown', time: '1 hour ago', status: 'active' },
  ];

  const systemMetrics = {
    cpuUsage: 65,
    memoryUsage: 78,
    storageUsage: 45,
    networkTraffic: 82,
    activeUsers: 1250,
    totalAlerts: 15,
    resolvedIncidents: 8,
    pendingActions: 3
  };

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
  const riskColors = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

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

  const renderDashboard = () => (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
      
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
        <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-base md:text-lg font-semibold text-white mb-2">Risk Score Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={riskScoreData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3C3C" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF3C3C" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#B0B0B0"/>
              <YAxis domain={[0, 100]} stroke="#B0B0B0"/>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <Tooltip contentStyle={{ background: '#1A1A1A', borderColor: '#FF3C3C', color: '#fff' }}/>
              <Area type="monotone" dataKey="score" stroke="#FF3C3C" fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* 2. Threat Type Occurrence */}
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
                  borderColor: '#FF3C3C', 
                  color: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #FF3C3C'
                }}
                formatter={(value) => [`${value} occurrences`, 'Count']}
              />
              <Bar 
                dataKey="count" 
                fill="#FF3C3C" 
                barSize={26}
                radius={[3, 3, 3, 3]}
                background={{ fill: '#0D0D0D', radius: 3 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#FF3C3C' }}>
          <Users className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B0B0B0]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
            style={{ borderColor: '#B0B0B0' }}
          />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
          style={{ borderColor: '#B0B0B0' }}
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="high-risk">High Risk</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#B0B0B0' }}>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">User</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Role</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Department</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Risk Score</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Status</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Last Login</th>
                <th className="text-left p-4 text-[#B0B0B0] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b" style={{ borderColor: '#B0B0B0' }}>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF3C3C' }}>
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{employee.name}</p>
                        <p className="text-[#B0B0B0] text-xs">{employee.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white">{employee.role}</td>
                  <td className="p-4 text-white">{employee.department}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 rounded-full" style={{ backgroundColor: '#0D0D0D' }}>
                        <div className={`h-2 rounded-full ${
                          employee.riskScore > 80 ? 'bg-red-500' : 
                          employee.riskScore > 60 ? 'bg-orange-500' : 'bg-green-500'
                        }`} style={{ width: `${employee.riskScore}%` }}></div>
                      </div>
                      <span className="text-white text-sm">{employee.riskScore}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      employee.status === 'active' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-[#B0B0B0]" />
                      <span className="text-white text-sm">{employee.lastLogin}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded hover:bg-[#0D0D0D] transition-colors">
                        <Eye className="h-4 w-4 text-[#B0B0B0] hover:text-white" />
                      </button>
                      <button className="p-1 rounded hover:bg-[#0D0D0D] transition-colors">
                        <Edit className="h-4 w-4 text-[#B0B0B0] hover:text-blue-400" />
                      </button>
                      <button className="p-1 rounded hover:bg-[#0D0D0D] transition-colors">
                        <Trash2 className="h-4 w-4 text-[#B0B0B0] hover:text-red-400" />
                      </button>
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
                placeholder="Ask AI for insights..."
                className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
                style={{ borderColor: '#B0B0B0' }}
              />
              <button className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#FF3C3C' }}>
                <Brain className="h-4 w-4" />
              </button>
            </div>
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

  const renderPolicies = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Policy Configuration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Alert Thresholds</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">High Risk Threshold</span>
              <input type="number" defaultValue={80} className="w-20 px-2 py-1 rounded border bg-transparent text-white" style={{ borderColor: '#B0B0B0' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Medium Risk Threshold</span>
              <input type="number" defaultValue={60} className="w-20 px-2 py-1 rounded border bg-transparent text-white" style={{ borderColor: '#B0B0B0' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Failed Login Attempts</span>
              <input type="number" defaultValue={5} className="w-20 px-2 py-1 rounded border bg-transparent text-white" style={{ borderColor: '#B0B0B0' }} />
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
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#FF3C3C' }}>
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">High Risk Users</span>
              <span className="text-[#FF3C3C] font-bold">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Medium Risk Users</span>
              <span className="text-yellow-400 font-bold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Low Risk Users</span>
              <span className="text-green-400 font-bold">1,235</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-6 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Threat Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Suspicious Logins</span>
              <span className="text-[#FF3C3C] font-bold">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Data Exports</span>
              <span className="text-orange-400 font-bold">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Unauthorized Access</span>
              <span className="text-red-500 font-bold">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
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
              {employees.slice(0, 5).map((employee) => (
                <tr key={employee.id} className="border-b" style={{ borderColor: '#B0B0B0' }}>
                  <td className="p-4 text-white">{employee.name}</td>
                  <td className="p-4 text-white">Login</td>
                  <td className="p-4 text-white">192.168.1.{employee.id}</td>
                  <td className="p-4 text-white">MacBook Pro</td>
                  <td className="p-4 text-white">{employee.location}</td>
                  <td className="p-4 text-white">{employee.lastLogin}</td>
                  <td className="p-4">
                    <span className="text-green-400 text-sm">Success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">System Settings</h1>
      
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
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default AdminPanel; 