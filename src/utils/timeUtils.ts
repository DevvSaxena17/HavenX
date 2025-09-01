// Time utility functions for real-time date, day, and time display

export interface TimeInfo {
  currentTime: Date;
  formattedTime: string;
  formattedDate: string;
  formattedDateTime: string;
  dayOfWeek: string;
  dayOfWeekShort: string;
  month: string;
  monthShort: string;
  year: number;
  hour: number;
  minute: number;
  second: number;
  isAM: boolean;
  timezone: string;
  unixTimestamp: number;
}

export interface RelativeTime {
  value: number;
  unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  isPast: boolean;
  formatted: string;
}

class TimeUtils {
  private static instance: TimeUtils;
  private timezone: string;

  private constructor() {
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  public static getInstance(): TimeUtils {
    if (!TimeUtils.instance) {
      TimeUtils.instance = new TimeUtils();
    }
    return TimeUtils.instance;
  }

  // Get current time information
  public getCurrentTimeInfo(): TimeInfo {
    const now = new Date();
    return this.formatTimeInfo(now);
  }

  // Format any date into TimeInfo
  public formatTimeInfo(date: Date): TimeInfo {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
      currentTime: date,
      formattedTime: this.formatTime(date),
      formattedDate: this.formatDate(date),
      formattedDateTime: this.formatDateTime(date),
      dayOfWeek: this.getDayOfWeek(date),
      dayOfWeekShort: this.getDayOfWeekShort(date),
      month: this.getMonth(date),
      monthShort: this.getMonthShort(date),
      year: date.getFullYear(),
      hour: hours,
      minute: minutes,
      second: seconds,
      isAM: hours < 12,
      timezone: this.timezone,
      unixTimestamp: Math.floor(date.getTime() / 1000)
    };
  }

  // Format time as HH:MM:SS AM/PM
  public formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: this.timezone
    });
  }

  // Format time as HH:MM AM/PM (without seconds)
  public formatTimeShort(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: this.timezone
    });
  }

  // Format date as MM/DD/YYYY
  public formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: this.timezone
    });
  }

  // Format date as Month DD, YYYY
  public formatDateLong(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: this.timezone
    });
  }

  // Format date and time together
  public formatDateTime(date: Date): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  // Format date and time (short version)
  public formatDateTimeShort(date: Date): string {
    return `${this.formatDate(date)} ${this.formatTimeShort(date)}`;
  }

  // Get day of week (full name)
  public getDayOfWeek(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: this.timezone
    });
  }

  // Get day of week (short name)
  public getDayOfWeekShort(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: this.timezone
    });
  }

  // Get month (full name)
  public getMonth(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      timeZone: this.timezone
    });
  }

  // Get month (short name)
  public getMonthShort(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      timeZone: this.timezone
    });
  }

  // Calculate relative time (e.g., "2 hours ago", "5 minutes ago")
  public getRelativeTime(date: Date): RelativeTime {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    const isPast = diffMs >= 0;

    if (diffYears > 0) {
      return {
        value: diffYears,
        unit: 'year',
        isPast,
        formatted: `${diffYears} year${diffYears > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`
      };
    } else if (diffMonths > 0) {
      return {
        value: diffMonths,
        unit: 'month',
        isPast,
        formatted: `${diffMonths} month${diffMonths > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`
      };
    } else if (diffWeeks > 0) {
      return {
        value: diffWeeks,
        unit: 'week',
        isPast,
        formatted: `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`
      };
    } else if (diffDays > 0) {
      return {
        value: diffDays,
        unit: 'day',
        isPast,
        formatted: `${diffDays} day${diffDays > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`
      };
    } else if (diffHours > 0) {
      return {
        value: diffHours,
        unit: 'hour',
        isPast,
        formatted: `${diffHours} hour${diffHours > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`
      };
    } else if (diffMinutes > 0) {
      return {
        value: diffMinutes,
        unit: 'minute',
        isPast,
        formatted: `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`
      };
    } else {
      return {
        value: diffSeconds,
        unit: 'second',
        isPast,
        formatted: `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} ${isPast ? 'ago' : 'from now'}`
      };
    }
  }

  // Get relative time for recent activities (e.g., "just now", "2 min ago")
  public getRelativeTimeShort(date: Date): string {
    const relative = this.getRelativeTime(date);
    
    if (relative.value === 0 && relative.unit === 'second') {
      return 'just now';
    } else if (relative.value < 1 && relative.unit === 'minute') {
      return 'just now';
    } else if (relative.unit === 'minute' && relative.value < 60) {
      return `${relative.value}m ago`;
    } else if (relative.unit === 'hour' && relative.value < 24) {
      return `${relative.value}h ago`;
    } else if (relative.unit === 'day' && relative.value < 7) {
      return `${relative.value}d ago`;
    } else {
      return this.formatDateShort(date);
    }
  }

  // Format date for recent activities
  public formatDateShort(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (targetDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (targetDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return this.formatDate(date);
    }
  }

  // Get timezone abbreviation
  public getTimezoneAbbr(): string {
    const date = new Date();
    const timeZoneName = date.toLocaleTimeString('en-us', { timeZoneName: 'short' });
    return timeZoneName.split(' ').pop() || 'UTC';
  }

  // Check if date is today
  public isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  // Check if date is yesterday
  public isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
  }

  // Format for logs (detailed timestamp)
  public formatForLogs(date: Date): string {
    const timeInfo = this.formatTimeInfo(date);
    return `${timeInfo.dayOfWeekShort}, ${timeInfo.monthShort} ${date.getDate()}, ${timeInfo.year} at ${timeInfo.formattedTime} ${this.getTimezoneAbbr()}`;
  }

  // Format for activity feeds
  public formatForActivity(date: Date): string {
    if (this.isToday(date)) {
      return `Today at ${this.formatTimeShort(date)}`;
    } else if (this.isYesterday(date)) {
      return `Yesterday at ${this.formatTimeShort(date)}`;
    } else {
      return this.formatDateTimeShort(date);
    }
  }

  // Format for notifications
  public formatForNotification(date: Date): string {
    const relative = this.getRelativeTime(date);
    if (relative.value === 0 && relative.unit === 'second') {
      return 'just now';
    } else if (relative.value < 1 && relative.unit === 'minute') {
      return 'just now';
    } else if (relative.unit === 'minute' && relative.value < 60) {
      return `${relative.value} min ago`;
    } else if (relative.unit === 'hour' && relative.value < 24) {
      return `${relative.value} hr ago`;
    } else {
      return this.formatDateShort(date);
    }
  }

  // Get current timestamp for database
  public getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  // Parse timestamp from database
  public parseTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  // Format duration (e.g., "2h 30m 15s")
  public formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  // Get week number
  public getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // Get quarter
  public getQuarter(date: Date): number {
    return Math.ceil((date.getMonth() + 1) / 3);
  }
}

export default TimeUtils; 