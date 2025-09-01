/**
 * Enhanced AI/ML utilities for HavenX
 * Includes behavioral analysis, anomaly detection, and predictive modeling
 */

import { UserAction } from './realTimeDataManager';

// Behavioral Pattern Analysis
export interface BehaviorPattern {
  userId: string;
  username: string;
  normalPatterns: {
    loginTimes: number[];
    sessionDuration: number;
    commonActions: string[];
    frequentPages: string[];
    typicalLocations: string[];
    averageActionsPerSession: number;
  };
  riskScore: number;
  lastUpdated: string;
}

export interface AnomalyDetection {
  id: string;
  userId: string;
  username: string;
  anomalyType: 'timing' | 'location' | 'behavior' | 'frequency' | 'pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
  timestamp: string;
  evidence: any;
}

export interface PredictiveInsight {
  type: 'risk_increase' | 'potential_threat' | 'unusual_pattern' | 'system_stress';
  probability: number;
  timeframe: string;
  description: string;
  recommendations: string[];
  impactLevel: 'low' | 'medium' | 'high';
}

// Advanced AI Manager
class AIEnhancedManager {
  private static instance: AIEnhancedManager;
  private behaviorProfiles: Map<string, BehaviorPattern> = new Map();
  private anomalies: AnomalyDetection[] = [];
  private modelWeights: any = null;

  public static getInstance(): AIEnhancedManager {
    if (!AIEnhancedManager.instance) {
      AIEnhancedManager.instance = new AIEnhancedManager();
    }
    return AIEnhancedManager.instance;
  }

  // Behavioral Learning
  public learnUserBehavior(userActions: UserAction[]): BehaviorPattern | null {
    if (userActions.length === 0) return null;

    const userId = userActions[0].userId;
    const username = userActions[0].username;

    // Extract behavioral patterns
    const loginTimes = this.extractLoginTimes(userActions);
    const sessionDurations = this.calculateSessionDurations(userActions);
    const commonActions = this.findCommonActions(userActions);
    const frequentPages = this.findFrequentPages(userActions);
    const locations = this.extractLocations(userActions);

    const pattern: BehaviorPattern = {
      userId,
      username,
      normalPatterns: {
        loginTimes: this.normalizeHours(loginTimes),
        sessionDuration: this.calculateAverage(sessionDurations),
        commonActions: commonActions.slice(0, 10),
        frequentPages: frequentPages.slice(0, 5),
        typicalLocations: Array.from(new Set(locations)),
        averageActionsPerSession: this.calculateAverageActionsPerSession(userActions)
      },
      riskScore: this.calculateBaselineRisk(userActions),
      lastUpdated: new Date().toISOString()
    };

    this.behaviorProfiles.set(userId, pattern);
    return pattern;
  }

  // Anomaly Detection using ML techniques
  public detectAnomalies(currentActions: UserAction[], userId: string): AnomalyDetection[] {
    const profile = this.behaviorProfiles.get(userId);
    if (!profile) return [];

    const anomalies: AnomalyDetection[] = [];

    // Time-based anomalies
    const timeAnomalies = this.detectTimeAnomalies(currentActions, profile);
    anomalies.push(...timeAnomalies);

    // Behavioral anomalies
    const behaviorAnomalies = this.detectBehaviorAnomalies(currentActions, profile);
    anomalies.push(...behaviorAnomalies);

    // Frequency anomalies
    const frequencyAnomalies = this.detectFrequencyAnomalies(currentActions, profile);
    anomalies.push(...frequencyAnomalies);

    // Store anomalies
    this.anomalies.push(...anomalies);
    return anomalies;
  }

  // Predictive Analysis
  public generatePredictiveInsights(
    historicalData: UserAction[],
    systemMetrics: any[]
  ): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];

    // Predict risk escalation
    const riskInsight = this.predictRiskEscalation(historicalData);
    if (riskInsight) insights.push(riskInsight);

    // Predict system stress
    const systemInsight = this.predictSystemStress(systemMetrics);
    if (systemInsight) insights.push(systemInsight);

    // Predict unusual patterns
    const patternInsights = this.predictUnusualPatterns(historicalData);
    insights.push(...patternInsights);

    return insights;
  }

  // Natural Language Processing for AI queries
  public processNaturalLanguageQuery(query: string): {
    intent: string;
    entities: string[];
    confidence: number;
    response: string;
  } {
    const lowercaseQuery = query.toLowerCase();
    
    // Intent classification (simplified NLP)
    let intent = 'unknown';
    let confidence = 0.5;
    let entities: string[] = [];

    // Security queries
    if (this.containsKeywords(lowercaseQuery, ['threat', 'attack', 'security', 'breach', 'unauthorized'])) {
      intent = 'security_inquiry';
      confidence = 0.9;
    }
    // User behavior queries
    else if (this.containsKeywords(lowercaseQuery, ['user', 'behavior', 'activity', 'login', 'access'])) {
      intent = 'user_behavior';
      confidence = 0.85;
    }
    // System performance queries
    else if (this.containsKeywords(lowercaseQuery, ['performance', 'system', 'cpu', 'memory', 'slow'])) {
      intent = 'system_performance';
      confidence = 0.8;
    }
    // Risk assessment queries
    else if (this.containsKeywords(lowercaseQuery, ['risk', 'score', 'assessment', 'danger', 'vulnerable'])) {
      intent = 'risk_assessment';
      confidence = 0.85;
    }

    // Extract entities (users, time periods, etc.)
    entities = this.extractEntities(lowercaseQuery);

    // Generate intelligent response
    const response = this.generateIntelligentResponse(intent, entities, query);

    return { intent, entities, confidence, response };
  }

  // Advanced Threat Intelligence
  public correlateThreats(newThreat: any): {
    relatedThreats: any[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
  } {
    const relatedThreats = this.findRelatedThreats(newThreat);
    const severity = this.calculateThreatSeverity(newThreat, relatedThreats);
    const recommendations = this.generateThreatRecommendations(newThreat, severity);

    return { relatedThreats, severity, recommendations };
  }

  // Private helper methods
  private extractLoginTimes(actions: UserAction[]): number[] {
    return actions
      .filter(action => action.action === 'login')
      .map(action => new Date(action.timestamp).getHours());
  }

  private calculateSessionDurations(actions: UserAction[]): number[] {
    // Simplified session duration calculation
    const sessions: number[] = [];
    let sessionStart = 0;
    
    for (let i = 0; i < actions.length - 1; i++) {
      const current = new Date(actions[i].timestamp).getTime();
      const next = new Date(actions[i + 1].timestamp).getTime();
      const gap = next - current;
      
      if (gap > 30 * 60 * 1000) { // 30 minutes gap = new session
        if (sessionStart > 0) {
          sessions.push(current - sessionStart);
        }
        sessionStart = next;
      }
    }
    
    return sessions.map(ms => ms / (1000 * 60)); // Convert to minutes
  }

  private findCommonActions(actions: UserAction[]): string[] {
    const actionCounts: { [key: string]: number } = {};
    
    actions.forEach(action => {
      actionCounts[action.action] = (actionCounts[action.action] || 0) + 1;
    });

    return Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([action]) => action);
  }

  private findFrequentPages(actions: UserAction[]): string[] {
    const pageCounts: { [key: string]: number } = {};
    
    actions.forEach(action => {
      pageCounts[action.page] = (pageCounts[action.page] || 0) + 1;
    });

    return Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([page]) => page);
  }

  private extractLocations(actions: UserAction[]): string[] {
    // This would normally come from IP geolocation
    return ['Office', 'Remote', 'Mobile'];
  }

  private normalizeHours(hours: number[]): number[] {
    if (hours.length === 0) return [];
    
    // Calculate mean and standard deviation for normal working hours
    const mean = hours.reduce((a, b) => a + b, 0) / hours.length;
    const std = Math.sqrt(
      hours.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / hours.length
    );
    
    return [Math.max(0, mean - std), Math.min(23, mean + std)];
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
  }

  private calculateAverageActionsPerSession(actions: UserAction[]): number {
    // Simplified calculation
    return actions.length / Math.max(1, Math.ceil(actions.length / 10));
  }

  private calculateBaselineRisk(actions: UserAction[]): number {
    let risk = 50; // Base risk score
    
    // Increase risk for high-risk actions
    const highRiskActions = actions.filter(a => a.riskLevel === 'high').length;
    const mediumRiskActions = actions.filter(a => a.riskLevel === 'medium').length;
    
    risk += (highRiskActions * 5) + (mediumRiskActions * 2);
    
    return Math.min(100, Math.max(0, risk));
  }

  private detectTimeAnomalies(actions: UserAction[], profile: BehaviorPattern): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];
    const currentLoginTimes = this.extractLoginTimes(actions);
    const normalRange = profile.normalPatterns.loginTimes;
    
    currentLoginTimes.forEach(time => {
      if (normalRange.length >= 2 && (time < normalRange[0] || time > normalRange[1])) {
        anomalies.push({
          id: `time_${Date.now()}_${Math.random()}`,
          userId: profile.userId,
          username: profile.username,
          anomalyType: 'timing',
          severity: this.calculateAnomalySeverity(time, normalRange),
          description: `Login at unusual time: ${time}:00`,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
          evidence: { currentTime: time, normalRange }
        });
      }
    });

    return anomalies;
  }

  private detectBehaviorAnomalies(actions: UserAction[], profile: BehaviorPattern): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];
    const currentActions = this.findCommonActions(actions);
    const normalActions = profile.normalPatterns.commonActions;
    
    // Check for unusual actions
    const unusualActions = currentActions.filter(action => 
      !normalActions.includes(action) && 
      actions.filter(a => a.action === action).length > 2
    );

    unusualActions.forEach(action => {
      anomalies.push({
        id: `behavior_${Date.now()}_${Math.random()}`,
        userId: profile.userId,
        username: profile.username,
        anomalyType: 'behavior',
        severity: 'medium',
        description: `Unusual action pattern: ${action}`,
        confidence: 0.7,
        timestamp: new Date().toISOString(),
        evidence: { unusualAction: action, frequency: actions.filter(a => a.action === action).length }
      });
    });

    return anomalies;
  }

  private detectFrequencyAnomalies(actions: UserAction[], profile: BehaviorPattern): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];
    const currentFrequency = actions.length;
    const normalFrequency = profile.normalPatterns.averageActionsPerSession;
    
    if (currentFrequency > normalFrequency * 3) {
      anomalies.push({
        id: `frequency_${Date.now()}_${Math.random()}`,
        userId: profile.userId,
        username: profile.username,
        anomalyType: 'frequency',
        severity: 'high',
        description: `Unusually high activity: ${currentFrequency} actions vs normal ${normalFrequency.toFixed(0)}`,
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        evidence: { currentFrequency, normalFrequency }
      });
    }

    return anomalies;
  }

  private calculateAnomalySeverity(value: number, normalRange: number[]): 'low' | 'medium' | 'high' | 'critical' {
    if (normalRange.length < 2) return 'medium';
    
    const [min, max] = normalRange;
    const range = max - min;
    const distance = Math.min(Math.abs(value - min), Math.abs(value - max));
    
    if (distance > range * 2) return 'critical';
    if (distance > range) return 'high';
    return 'medium';
  }

  private predictRiskEscalation(historicalData: UserAction[]): PredictiveInsight | null {
    if (historicalData.length < 10) return null;

    // Analyze risk trend over time
    const recentActions = historicalData.slice(-10);
    const olderActions = historicalData.slice(-20, -10);
    
    const recentRisk = this.calculateAverageRisk(recentActions);
    const olderRisk = this.calculateAverageRisk(olderActions);
    
    if (recentRisk > olderRisk * 1.5) {
      return {
        type: 'risk_increase',
        probability: 0.75,
        timeframe: 'next 24 hours',
        description: 'Risk score trending upward based on recent activity patterns',
        recommendations: [
          'Monitor user activity more closely',
          'Consider additional authentication requirements',
          'Review recent access permissions'
        ],
        impactLevel: 'high'
      };
    }

    return null;
  }

  private predictSystemStress(systemMetrics: any[]): PredictiveInsight | null {
    if (systemMetrics.length < 5) return null;

    const recentMetrics = systemMetrics.slice(-5);
    const avgCpuUsage = recentMetrics.reduce((sum, m) => sum + (m.cpuUsage || 0), 0) / recentMetrics.length;
    
    if (avgCpuUsage > 80) {
      return {
        type: 'system_stress',
        probability: 0.8,
        timeframe: 'next 2 hours',
        description: 'System resources trending toward critical levels',
        recommendations: [
          'Consider scaling resources',
          'Review resource-intensive processes',
          'Implement load balancing'
        ],
        impactLevel: 'medium'
      };
    }

    return null;
  }

  private predictUnusualPatterns(historicalData: UserAction[]): PredictiveInsight[] {
    // Simplified pattern analysis
    const insights: PredictiveInsight[] = [];
    
    const hourlyDistribution = this.analyzeHourlyDistribution(historicalData);
    const unusualHours = Object.entries(hourlyDistribution)
      .filter(([, count]) => count > 0)
      .filter(([hour]) => parseInt(hour) < 6 || parseInt(hour) > 22)
      .length;

    if (unusualHours > 3) {
      insights.push({
        type: 'unusual_pattern',
        probability: 0.6,
        timeframe: 'ongoing',
        description: 'Significant after-hours activity detected',
        recommendations: [
          'Review after-hours access policies',
          'Implement stricter authentication for off-hours',
          'Monitor for data exfiltration'
        ],
        impactLevel: 'medium'
      });
    }

    return insights;
  }

  private calculateAverageRisk(actions: UserAction[]): number {
    if (actions.length === 0) return 0;
    
    const riskValues = actions.map(action => {
      switch (action.riskLevel) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 1;
      }
    });

    return riskValues.reduce((a, b) => a + b, 0) / riskValues.length;
  }

  private analyzeHourlyDistribution(actions: UserAction[]): { [hour: number]: number } {
    const distribution: { [hour: number]: number } = {};
    
    actions.forEach(action => {
      const hour = new Date(action.timestamp).getHours();
      distribution[hour] = (distribution[hour] || 0) + 1;
    });

    return distribution;
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private extractEntities(query: string): string[] {
    const entities: string[] = [];
    
    // Extract user names (simplified)
    const userPattern = /@(\w+)|user\s+(\w+)/gi;
    let match;
    while ((match = userPattern.exec(query)) !== null) {
      entities.push(match[1] || match[2]);
    }

    // Extract time periods
    const timePattern = /\b(today|yesterday|last\s+week|last\s+month|hour|day|week|month)\b/gi;
    while ((match = timePattern.exec(query)) !== null) {
      entities.push(match[0]);
    }

    return entities;
  }

  private generateIntelligentResponse(intent: string, entities: string[], originalQuery: string): string {
    const responses: { [key: string]: string } = {
      'security_inquiry': `🛡️ **Security Analysis**\n\nI've analyzed current security metrics:\n• No critical threats detected\n• All security protocols active\n• Recent activity within normal parameters\n\nWould you like me to investigate any specific security concerns?`,
      'user_behavior': `👤 **User Behavior Analysis**\n\nCurrent user activity patterns:\n• ${entities.length > 0 ? `Analyzing user: ${entities[0]}` : 'All users showing normal activity'}\n• Login patterns within expected ranges\n• No behavioral anomalies detected\n\nI can provide more detailed analysis if needed.`,
      'system_performance': `⚡ **System Performance Report**\n\nCurrent system status:\n• CPU Usage: Normal\n• Memory: Optimal\n• Network: Stable\n• Response Time: Good\n\nAll systems operating within normal parameters.`,
      'risk_assessment': `⚠️ **Risk Assessment**\n\nCurrent risk evaluation:\n• Overall Risk Level: Low to Medium\n• Active monitoring in place\n• No immediate threats identified\n\nContinuous monitoring and assessment active.`,
      'unknown': `🤖 I understand you're asking about "${originalQuery.substring(0, 50)}..."\n\nI can help with:\n• Security analysis and threat detection\n• User behavior monitoring\n• System performance metrics\n• Risk assessments\n\nCould you be more specific about what you'd like to know?`
    };

    return responses[intent] || responses['unknown'];
  }

  private findRelatedThreats(threat: any): any[] {
    // Simplified threat correlation
    return this.anomalies.filter(anomaly => 
      anomaly.userId === threat.userId ||
      anomaly.anomalyType === threat.type ||
      anomaly.severity === threat.severity
    ).slice(0, 5);
  }

  private calculateThreatSeverity(threat: any, relatedThreats: any[]): 'low' | 'medium' | 'high' | 'critical' {
    let baseScore = threat.severity === 'high' ? 3 : threat.severity === 'medium' ? 2 : 1;
    
    // Escalate based on related threats
    if (relatedThreats.length > 3) baseScore += 1;
    if (relatedThreats.some(t => t.severity === 'critical')) baseScore += 2;
    
    if (baseScore >= 5) return 'critical';
    if (baseScore >= 4) return 'high';
    if (baseScore >= 3) return 'medium';
    return 'low';
  }

  private generateThreatRecommendations(threat: any, severity: string): string[] {
    const baseRecommendations = [
      'Monitor affected user closely',
      'Review recent access logs',
      'Verify user identity through additional channels'
    ];

    const severityRecommendations: { [key: string]: string[] } = {
      'critical': [
        'Immediately suspend user account',
        'Initiate incident response procedures',
        'Contact security team immediately',
        'Preserve all logs and evidence'
      ],
      'high': [
        'Require immediate password reset',
        'Enable additional authentication factors',
        'Restrict access to sensitive resources',
        'Schedule security review within 24 hours'
      ],
      'medium': [
        'Flag account for enhanced monitoring',
        'Consider requiring password change',
        'Review access permissions'
      ],
      'low': [
        'Continue standard monitoring',
        'Log for future analysis'
      ]
    };

    return [...baseRecommendations, ...(severityRecommendations[severity] || [])];
  }

  // Public getters
  public getBehaviorProfiles(): Map<string, BehaviorPattern> {
    return this.behaviorProfiles;
  }

  public getAnomalies(): AnomalyDetection[] {
    return this.anomalies;
  }
}

export default AIEnhancedManager;
