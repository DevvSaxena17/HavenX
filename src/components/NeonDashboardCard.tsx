import React from 'react';
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

// Predefined card types
export const LiveThreatsCard: React.FC<{ count: number; change: number }> = ({ count, change }) => (
  <NeonCard
    title="Live Threats Detected"
    value={count}
    change={change}
    icon={AlertTriangle}
    color="#FF3C3C"
    sparklineData={[12, 15, 8, 20, 18, 25, 22, 30, 28, 35]}
    animate={true}
  />
);

export const RiskScoreCard: React.FC<{ score: number; change: number }> = ({ score, change }) => (
  <NeonCard
    title="Risk Score"
    value={`${score}%`}
    change={change}
    icon={Shield}
    color={score > 80 ? "#FF3C3C" : score > 60 ? "#FFA500" : "#00FF00"}
    sparklineData={[45, 52, 48, 65, 72, 68, 75, 82, 78, 85]}
    animate={true}
  />
);

export const AnomalousLoginsCard: React.FC<{ count: number; change: number }> = ({ count, change }) => (
  <NeonCard
    title="Anomalous Logins"
    value={count}
    change={change}
    icon={Eye}
    color="#FFA500"
    sparklineData={[3, 5, 2, 8, 6, 12, 9, 15, 11, 18]}
    animate={true}
  />
);

export const ActiveUsersCard: React.FC<{ count: number; change: number }> = ({ count, change }) => (
  <NeonCard
    title="Active Users"
    value={count}
    change={change}
    icon={Users}
    color="#00BFFF"
    sparklineData={[1200, 1250, 1180, 1300, 1280, 1350, 1320, 1400, 1380, 1450]}
    animate={false}
  />
);

export const SystemHealthCard: React.FC<{ status: string; uptime: string }> = ({ status, uptime }) => (
  <NeonCard
    title="System Health"
    value={status}
    icon={Activity}
    color={status === 'Healthy' ? "#00FF00" : "#FF3C3C"}
    sparklineData={[95, 98, 96, 99, 97, 100, 98, 99, 97, 98]}
    animate={status !== 'Healthy'}
  />
);

export default NeonCard; 