import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Shield, 
  Activity,
  Zap,
  Eye,
  Clock,
  MapPin
} from 'lucide-react';
import RealTimeDataManager from '../utils/realTimeDataManager';

interface NeonCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color: string;
  sparklineData?: number[];
  animate?: boolean;
  className?: string;
}

const NeonCard: React.FC<NeonCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  sparklineData = [],
  animate = true,
  className = ""
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const SparklineChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full h-8 mt-2">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
            opacity="0.8"
          />
          <polygon
            fill={color}
            opacity="0.1"
            points={`0,100 ${points} 100,100`}
          />
        </svg>
      </div>
    );
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-lg p-6 border relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: '#1A1A1A', 
        borderColor: color,
        boxShadow: `0 0 20px ${color}20`
      }}
    >
      {/* Neon glow effect */}
      <div 
        className="absolute inset-0 rounded-lg opacity-20"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${color}40, transparent 70%)`,
          filter: 'blur(20px)'
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <h3 className="text-[#B0B0B0] text-sm font-medium">{title}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">{value}</span>
                {change !== undefined && (
                  <div className="flex items-center space-x-1">
                    {change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {Math.abs(change)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sparkline Chart */}
        {sparklineData.length > 0 && (
          <SparklineChart data={sparklineData} color={color} />
        )}

        {/* Animated pulse indicator */}
        {animate && (
          <motion.div
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

// Real-time dashboard cards that use actual data
export const LiveThreatsCard: React.FC = () => {
  const [data, setData] = useState({ count: 0, change: 0, sparkline: [] as number[] });
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());

  useEffect(() => {
    const updateData = () => {
      const threats = realTimeManager.getActiveThreatsCount();
      const metrics = realTimeManager.getMetricsHistory(1);
      const sparkline = metrics.map(m => m.threatEvents).slice(-10);
      
      // Calculate change from previous data
      const change = sparkline.length > 1 
        ? ((sparkline[sparkline.length - 1] - sparkline[sparkline.length - 2]) / Math.max(sparkline[sparkline.length - 2], 1)) * 100
        : 0;

      setData({ 
        count: threats, 
        change: Math.round(change),
        sparkline
      });
    };

    updateData();
    const interval = setInterval(updateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeManager]);

  return (
    <NeonCard
      title="Live Threats Detected"
      value={data.count}
      change={data.change}
      icon={AlertTriangle}
      color="#FF3C3C"
      sparklineData={data.sparkline}
      animate={data.count > 0}
    />
  );
};

export const RiskScoreCard: React.FC = () => {
  const [data, setData] = useState({ score: 0, change: 0, sparkline: [] as number[] });
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());

  useEffect(() => {
    const updateData = () => {
      const metrics = realTimeManager.getCurrentMetrics();
      const history = realTimeManager.getMetricsHistory(1);
      const sparkline = history.map(m => m.riskScore).slice(-10);
      
      // Calculate change from previous data
      const change = sparkline.length > 1 
        ? sparkline[sparkline.length - 1] - sparkline[sparkline.length - 2]
        : 0;

      setData({ 
        score: metrics.riskScore, 
        change: Math.round(change),
        sparkline
      });
    };

    updateData();
    const interval = setInterval(updateData, 30000);

    return () => clearInterval(interval);
  }, [realTimeManager]);

  return (
    <NeonCard
      title="Risk Score"
      value={`${data.score}%`}
      change={data.change}
      icon={Shield}
      color={data.score > 80 ? "#FF3C3C" : data.score > 60 ? "#FFA500" : "#00FF00"}
      sparklineData={data.sparkline}
      animate={data.score > 70}
    />
  );
};

export const AnomalousLoginsCard: React.FC = () => {
  const [data, setData] = useState({ count: 0, change: 0, sparkline: [] as number[] });
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());

  useEffect(() => {
    const updateData = () => {
      const metrics = realTimeManager.getCurrentMetrics();
      const history = realTimeManager.getMetricsHistory(1);
      const sparkline = history.map(m => m.failedLogins).slice(-10);
      
      const change = sparkline.length > 1 
        ? ((sparkline[sparkline.length - 1] - sparkline[sparkline.length - 2]) / Math.max(sparkline[sparkline.length - 2], 1)) * 100
        : 0;

      setData({ 
        count: metrics.failedLogins, 
        change: Math.round(change),
        sparkline
      });
    };

    updateData();
    const interval = setInterval(updateData, 30000);

    return () => clearInterval(interval);
  }, [realTimeManager]);

  return (
    <NeonCard
      title="Failed Logins (24h)"
      value={data.count}
      change={data.change}
      icon={Eye}
      color="#FFA500"
      sparklineData={data.sparkline}
      animate={data.count > 0}
    />
  );
};

export const ActiveUsersCard: React.FC = () => {
  const [data, setData] = useState({ count: 0, change: 0, sparkline: [] as number[] });
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());

  useEffect(() => {
    const updateData = () => {
      const activeUsers = realTimeManager.getActiveUsersCount();
      const totalUsers = realTimeManager.getTotalUsersCount();
      const history = realTimeManager.getMetricsHistory(1);
      const sparkline = history.map(m => m.activeUsers).slice(-10);
      
      const change = sparkline.length > 1 
        ? ((sparkline[sparkline.length - 1] - sparkline[sparkline.length - 2]) / Math.max(sparkline[sparkline.length - 2], 1)) * 100
        : 0;

      setData({ 
        count: activeUsers, 
        change: Math.round(change),
        sparkline
      });
    };

    updateData();
    const interval = setInterval(updateData, 5000); // Update every 5 seconds for active users

    return () => clearInterval(interval);
  }, [realTimeManager]);

  return (
    <NeonCard
      title="Active Users"
      value={data.count}
      change={data.change}
      icon={Users}
      color="#00BFFF"
      sparklineData={data.sparkline}
      animate={false}
    />
  );
};

export const SystemHealthCard: React.FC = () => {
  const [data, setData] = useState({ status: 'Healthy', color: '#00FF00', uptime: '99.9%' });
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());

  useEffect(() => {
    const updateData = () => {
      const metrics = realTimeManager.getCurrentMetrics();
      const sparkline = realTimeManager.getMetricsHistory(1).map(m => 100 - m.riskScore).slice(-10);
      
      let status = 'Healthy';
      let color = '#00FF00';
      
      if (metrics.systemHealth === 'critical') {
        status = 'Critical';
        color = '#FF3C3C';
      } else if (metrics.systemHealth === 'warning') {
        status = 'Warning';
        color = '#FFA500';
      }

      // Calculate uptime based on system health
      const uptime = metrics.systemHealth === 'healthy' ? '99.9%' : 
                     metrics.systemHealth === 'warning' ? '98.5%' : '95.2%';

      setData({ status, color, uptime });
    };

    updateData();
    const interval = setInterval(updateData, 30000);

    return () => clearInterval(interval);
  }, [realTimeManager]);

  return (
    <NeonCard
      title="System Health"
      value={data.status}
      icon={Activity}
      color={data.color}
      sparklineData={[98, 99, 97, 100, 98, 99, 97, 100, 99, 100]}
      animate={data.status !== 'Healthy'}
    />
  );
};

export default NeonCard; 