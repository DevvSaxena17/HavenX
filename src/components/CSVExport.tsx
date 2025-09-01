import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Users, 
  Activity, 
  Shield, 
  BarChart3, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Smartphone,
  Database,
  Server,
  Network,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import CSVManager from '../utils/csvManager';

interface CSVExportProps {
  onExportComplete?: () => void;
}

const CSVExport: React.FC<CSVExportProps> = ({ onExportComplete }) => {
  const [selectedReport, setSelectedReport] = useState('users');
  const [dateRange, setDateRange] = useState('7d');
  const [isExporting, setIsExporting] = useState(false);
  const [csvManager] = useState(() => CSVManager.getInstance());

  const reportTypes = [
    {
      id: 'users',
      name: 'User Data',
      description: 'Complete user information and profiles',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      id: 'logins',
      name: 'Login Records',
      description: 'All login attempts and session data',
      icon: Activity,
      color: 'text-green-400'
    },
    {
      id: 'activities',
      name: 'User Activities',
      description: 'Detailed user activity logs',
      icon: Shield,
      color: 'text-purple-400'
    },
    {
      id: 'analytics',
      name: 'Security Analytics',
      description: 'Security metrics and risk analysis',
      icon: BarChart3,
      color: 'text-orange-400'
    }
  ];

  const dateRanges = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let csvData = '';
      let filename = '';

      switch (selectedReport) {
        case 'users':
          csvData = csvManager.exportUsersToCSV();
          filename = `users_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'logins':
          csvData = csvManager.exportLoginRecordsToCSV();
          filename = `login_records_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'activities':
          csvData = csvManager.exportUserActivitiesToCSV();
          filename = `user_activities_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'analytics':
          csvData = generateAnalyticsCSV();
          filename = `security_analytics_${new Date().toISOString().split('T')[0]}.csv`;
          break;
      }

      downloadCSV(csvData, filename);
      onExportComplete?.();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateAnalyticsCSV = (): string => {
    const stats = csvManager.getLoginStatistics();
    const riskAnalysis = csvManager.getRiskAnalysis();
    
    const headers = [
      'Metric', 'Value', 'Description'
    ];

    const rows = [
      ['Total Logins', stats.totalLogins.toString(), 'Total number of login attempts'],
      ['Successful Logins', stats.successfulLogins.toString(), 'Number of successful logins'],
      ['Failed Logins', stats.failedLogins.toString(), 'Number of failed login attempts'],
      ['Success Rate', `${((stats.successfulLogins / stats.totalLogins) * 100).toFixed(2)}%`, 'Percentage of successful logins'],
      ['Unique Users', stats.uniqueUsers.toString(), 'Number of unique users who logged in'],
      ['Average Security Score', stats.averageSecurityScore.toString(), 'Average security score across all users'],
      ['High Risk Users', riskAnalysis.highRiskUsers.length.toString(), 'Users with security score below 60'],
      ['Medium Risk Users', riskAnalysis.mediumRiskUsers.length.toString(), 'Users with security score 60-79'],
      ['Low Risk Users', riskAnalysis.lowRiskUsers.length.toString(), 'Users with security score 80+'],
      ['Report Generated', new Date().toISOString(), 'Timestamp of report generation']
    ];

    return convertToCSV([headers, ...rows]);
  };

  const convertToCSV = (rows: string[][]): string => {
    return rows.map(row => 
      row.map(cell => {
        const escaped = cell.replace(/"/g, '""');
        return cell.includes(',') || cell.includes('"') || cell.includes('\n') 
          ? `"${escaped}"` 
          : escaped;
      }).join(',')
    ).join('\n');
  };

  const downloadCSV = (csvData: string, filename: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getReportStats = () => {
    const stats = csvManager.getLoginStatistics();
    const riskAnalysis = csvManager.getRiskAnalysis();
    
    return {
      totalUsers: csvManager.getAllUsers().length,
      totalLogins: stats.totalLogins,
      successRate: stats.totalLogins > 0 ? ((stats.successfulLogins / stats.totalLogins) * 100).toFixed(1) : '0',
      highRiskUsers: riskAnalysis.highRiskUsers.length,
      averageSecurityScore: stats.averageSecurityScore
    };
  };

  const reportStats = getReportStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">CSV Export & Reports</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-[#B0B0B0]" />
          <span className="text-[#B0B0B0] text-sm">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-400" />
            <div>
              <p className="text-white font-semibold">{reportStats.totalUsers}</p>
              <p className="text-[#B0B0B0] text-sm">Total Users</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-green-400" />
            <div>
              <p className="text-white font-semibold">{reportStats.totalLogins}</p>
              <p className="text-[#B0B0B0] text-sm">Total Logins</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div>
              <p className="text-white font-semibold">{reportStats.successRate}%</p>
              <p className="text-[#B0B0B0] text-sm">Success Rate</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-orange-400" />
            <div>
              <p className="text-white font-semibold">{reportStats.averageSecurityScore}</p>
              <p className="text-[#B0B0B0] text-sm">Avg Security Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${
              selectedReport === report.id 
                ? 'border-[#FF3C3C] bg-red-900 bg-opacity-20' 
                : 'border-[#B0B0B0] hover:border-[#FF3C3C]'
            }`}
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <report.icon className={`h-6 w-6 ${report.color}`} />
              <h3 className="text-white font-semibold">{report.name}</h3>
            </div>
            <p className="text-[#B0B0B0] text-sm">{report.description}</p>
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div className="rounded-lg border p-6" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <h3 className="text-lg font-semibold text-white mb-4">Export Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">Selected Report</label>
            <div className="p-3 bg-gray-800 border border-gray-600 rounded text-white">
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-6 py-3 bg-[#FF3C3C] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="rounded-lg border p-6" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <h3 className="text-lg font-semibold text-white mb-4">Report Preview</h3>
        
        {selectedReport === 'users' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-white">User data will include: ID, Username, Name, Email, Role, Department, Security Score, etc.</span>
            </div>
            <div className="text-[#B0B0B0] text-sm">
              Total users to export: {reportStats.totalUsers}
            </div>
          </div>
        )}
        
        {selectedReport === 'logins' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-white">Login records will include: Timestamp, IP Address, Device, Status, Risk Level, etc.</span>
            </div>
            <div className="text-[#B0B0B0] text-sm">
              Total login records to export: {reportStats.totalLogins}
            </div>
          </div>
        )}
        
        {selectedReport === 'activities' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-400" />
              <span className="text-white">User activities will include: Actions, Resources accessed, Risk levels, Timestamps, etc.</span>
            </div>
            <div className="text-[#B0B0B0] text-sm">
              Activity data from all user sessions
            </div>
          </div>
        )}
        
        {selectedReport === 'analytics' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-orange-400" />
              <span className="text-white">Security analytics will include: Login statistics, Risk analysis, Security scores, etc.</span>
            </div>
            <div className="text-[#B0B0B0] text-sm">
              Comprehensive security metrics and analysis
            </div>
          </div>
        )}
      </div>

      {/* Export History */}
      <div className="rounded-lg border p-6" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Exports</h3>
        <div className="text-[#B0B0B0] text-sm">
          <p>• No recent exports found</p>
          <p className="mt-2">Export history will be displayed here for future reference.</p>
        </div>
      </div>
    </div>
  );
};

export default CSVExport; 