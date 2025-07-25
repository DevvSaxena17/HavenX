import { UserLogEntry, ThreatAnalysis } from '../types/security';

export class ThreatAnalyzer {
  static analyzeLogs(logs: UserLogEntry[]): ThreatAnalysis {
    if (!logs.length) {
      return {
        topRiskUser: "No data",
        topRiskScore: 0,
        alertsToday: 0,
        averageRiskScore: 0,
        peakActivityTime: "No activity",
        aiSummary: "No suspicious activity detected.",
        prediction: "System monitoring normal patterns.",
        suggestedAction: "Continue standard monitoring protocols."
      };
    }

    // Find highest risk user
    const highestRiskLog = logs.reduce((max, log) => 
      log.risk_score > max.risk_score ? log : max
    );

    // Count high-risk alerts (score > 75)
    const alertsToday = logs.filter(log => log.risk_score > 75).length;

    // Calculate average risk score
    const averageRiskScore = Math.round(
      logs.reduce((sum, log) => sum + log.risk_score, 0) / logs.length
    );

    // Determine peak activity time
    const peakActivityTime = this.calculatePeakActivityTime(logs);

    // Generate AI summary
    const aiSummary = this.generateAISummary(logs, highestRiskLog);

    // Generate prediction
    const prediction = this.generatePrediction(logs, highestRiskLog);

    // Generate suggested action
    const suggestedAction = this.generateSuggestedAction(highestRiskLog);

    return {
      topRiskUser: highestRiskLog.username,
      topRiskScore: highestRiskLog.risk_score,
      alertsToday,
      averageRiskScore,
      peakActivityTime,
      aiSummary,
      prediction,
      suggestedAction
    };
  }

  private static calculatePeakActivityTime(logs: UserLogEntry[]): string {
    const hourCounts: { [key: number]: number } = {};
    
    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourCounts)
      .reduce(([maxHour, maxCount], [hour, count]) => 
        count > maxCount ? [hour, count] : [maxHour, maxCount]
      )[0];

    const startHour = parseInt(peakHour);
    const endHour = (startHour + 2) % 24;
    
    return `${this.formatHour(startHour)} – ${this.formatHour(endHour)}`;
  }

  private static formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  private static generateAISummary(logs: UserLogEntry[], topRiskLog: UserLogEntry): string {
    const userLogs = logs.filter(log => log.username === topRiskLog.username);
    const externalAccess = userLogs.filter(log => log.access_type === 'external');
    const suspiciousActions = userLogs.filter(log => 
      log.action.includes('restricted') || 
      log.action.includes('confidential') ||
      log.action.includes('unusual')
    );

    let summary = `${topRiskLog.username} `;
    
    if (suspiciousActions.length > 0) {
      summary += `performed ${suspiciousActions.length} suspicious action(s) including ${suspiciousActions[0].action.toLowerCase()}`;
    } else {
      summary += `showed elevated risk behavior`;
    }

    if (externalAccess.length > 0) {
      summary += ` using external access from ${topRiskLog.location}`;
    }

    summary += `. Risk score peaked at ${topRiskLog.risk_score}. This deviates significantly from normal user patterns.`;

    return summary;
  }

  private static generatePrediction(logs: UserLogEntry[], topRiskLog: UserLogEntry): string {
    const userLogs = logs.filter(log => log.username === topRiskLog.username);
    const trendingUp = userLogs.length > 1 && 
      userLogs[userLogs.length - 1].risk_score > userLogs[0].risk_score;

    if (topRiskLog.risk_score >= 90) {
      return `${topRiskLog.username} is likely to trigger critical alerts within the next 12 hours. Immediate intervention recommended.`;
    } else if (topRiskLog.risk_score >= 80) {
      return `${topRiskLog.username} shows concerning patterns and may escalate to critical risk within 24-48 hours.`;
    } else if (trendingUp) {
      return `Risk scores are trending upward. Monitor ${topRiskLog.username} closely for potential escalation.`;
    } else {
      return `Current risk levels appear stable. Continue standard monitoring protocols.`;
    }
  }

  private static generateSuggestedAction(topRiskLog: UserLogEntry): string {
    if (topRiskLog.risk_score >= 90) {
      return `Immediately suspend ${topRiskLog.username}'s access and initiate security incident protocol.`;
    } else if (topRiskLog.risk_score >= 80) {
      return `Restrict ${topRiskLog.username}'s external access and schedule immediate behavioral review.`;
    } else if (topRiskLog.access_type === 'external') {
      return `Monitor ${topRiskLog.username}'s external access patterns and consider additional authentication.`;
    } else {
      return `Schedule routine security check for ${topRiskLog.username} and review access permissions.`;
    }
  }
}