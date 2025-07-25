export interface UserLogEntry {
  username: string;
  timestamp: string;
  action: string;
  ip: string;
  risk_score: number;
  location: string;
  access_type: 'internal' | 'external';
}

export interface ThreatAnalysis {
  topRiskUser: string;
  topRiskScore: number;
  alertsToday: number;
  averageRiskScore: number;
  peakActivityTime: string;
  aiSummary: string;
  prediction: string;
  suggestedAction: string;
}

export interface User {
  username: string;
  department: string;
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  totalAlerts: number;
  averageRiskScore: number;
}