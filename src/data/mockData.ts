import { UserLogEntry, User } from '../types/security';

export const sampleLogs: UserLogEntry[] = [
  {
    username: "User23",
    timestamp: "2025-01-20T23:45:00",
    action: "Accessed restricted file",
    ip: "192.168.0.12",
    risk_score: 88,
    location: "Delhi",
    access_type: "external"
  },
  {
    username: "User23",
    timestamp: "2025-01-20T22:10:00",
    action: "Downloaded confidential report",
    ip: "192.168.0.12",
    risk_score: 92,
    location: "Delhi",
    access_type: "external"
  },
  {
    username: "User17",
    timestamp: "2025-01-20T21:10:00",
    action: "Logged in",
    ip: "192.168.0.7",
    risk_score: 60,
    location: "Noida",
    access_type: "internal"
  },
  {
    username: "User42",
    timestamp: "2025-01-20T11:25:00",
    action: "Changed device",
    ip: "10.0.0.5",
    risk_score: 76,
    location: "Remote",
    access_type: "external"
  },
  {
    username: "User15",
    timestamp: "2025-01-20T14:30:00",
    action: "Failed login attempt",
    ip: "203.0.113.45",
    risk_score: 85,
    location: "Unknown",
    access_type: "external"
  },
  {
    username: "User08",
    timestamp: "2025-01-20T16:20:00",
    action: "Bulk file download",
    ip: "192.168.1.100",
    risk_score: 79,
    location: "Mumbai",
    access_type: "internal"
  },
  {
    username: "User33",
    timestamp: "2025-01-20T19:45:00",
    action: "Database query unusual pattern",
    ip: "192.168.2.50",
    risk_score: 82,
    location: "Bangalore",
    access_type: "internal"
  }
];

export const users: User[] = [
  {
    username: "User23",
    department: "Finance",
    lastActivity: "2025-01-20T23:45:00",
    riskLevel: "critical",
    totalAlerts: 5,
    averageRiskScore: 90
  },
  {
    username: "User15",
    department: "IT",
    lastActivity: "2025-01-20T14:30:00",
    riskLevel: "high",
    totalAlerts: 3,
    averageRiskScore: 83
  },
  {
    username: "User33",
    department: "Engineering",
    lastActivity: "2025-01-20T19:45:00",
    riskLevel: "high",
    totalAlerts: 2,
    averageRiskScore: 80
  },
  {
    username: "User08",
    department: "Marketing",
    lastActivity: "2025-01-20T16:20:00",
    riskLevel: "medium",
    totalAlerts: 1,
    averageRiskScore: 75
  },
  {
    username: "User42",
    department: "HR",
    lastActivity: "2025-01-20T11:25:00",
    riskLevel: "medium",
    totalAlerts: 2,
    averageRiskScore: 72
  },
  {
    username: "User17",
    department: "Sales",
    lastActivity: "2025-01-20T21:10:00",
    riskLevel: "low",
    totalAlerts: 0,
    averageRiskScore: 45
  }
];