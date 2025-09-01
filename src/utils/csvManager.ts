// CSV Manager for User Data and Login Records
import bcrypt from 'bcryptjs';
import { sanitizeInput, containsMaliciousContent } from './validation';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  username: string;
  password: string; // Now properly hashed with bcrypt
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  department: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  securityScore: number;
  failedLoginAttempts: number;
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
  accountLockedUntil?: string;
  passwordHistory?: string[];
}

export interface LoginRecord {
  id: string;
  userId: string;
  username: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  device: string;
  status: 'success' | 'failed' | 'suspended';
  riskLevel: 'low' | 'medium' | 'high';
  sessionDuration?: number;
  logoutTime?: string;
  notes?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  username: string;
  action: string;
  timestamp: string;
  resource: string;
  ipAddress: string;
  device: string;
  riskLevel: 'low' | 'medium' | 'high';
  details?: string;
}

class CSVManager {
  private static instance: CSVManager;
  
  // Default user data
  private defaultUsers: User[] = [
    {
      id: '1',
      username: 'devv',
      password: 'devv123',
      name: 'Devv Saxena',
              email: 'devv@havenx.com',
      role: 'admin',
      department: 'IT',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      securityScore: 95,
      failedLoginAttempts: 0,
      lastPasswordChange: new Date().toISOString(),
      twoFactorEnabled: true
    },
    {
      id: '2',
      username: 'priyanshi',
      password: 'priyanshi123',
      name: 'Priyanshi Saxena',
              email: 'priyanshi@havenx.com',
      role: 'analyst',
      department: 'Security',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      securityScore: 88,
      failedLoginAttempts: 0,
      lastPasswordChange: new Date().toISOString(),
      twoFactorEnabled: true
    },
    {
      id: '3',
      username: 'mohak',
      password: 'mohak123',
      name: 'Mohak',
              email: 'mohak@havenx.com',
      role: 'viewer',
      department: 'Engineering',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      securityScore: 75,
      failedLoginAttempts: 0,
      lastPasswordChange: new Date().toISOString(),
      twoFactorEnabled: false
    },
    {
      id: '4',
      username: 'tushar',
      password: 'tushar123',
      name: 'Tushar Suthar',
              email: 'tushar@havenx.com',
      role: 'viewer',
      department: 'Marketing',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      securityScore: 82,
      failedLoginAttempts: 0,
      lastPasswordChange: new Date().toISOString(),
      twoFactorEnabled: false
    },
    {
      id: '5',
      username: 'riya',
      password: 'riya123',
      name: 'Riya Raut',
              email: 'riya@havenx.com',
      role: 'viewer',
      department: 'HR',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      securityScore: 78,
      failedLoginAttempts: 0,
      lastPasswordChange: new Date().toISOString(),
      twoFactorEnabled: false
    }
  ];

  private users: User[] = [];
  private loginRecords: LoginRecord[] = [];
  private userActivities: UserActivity[] = [];

  constructor() {
    this.initializeDefaultUsers();
    this.loadData();
  }

  // Initialize default users with hashed passwords
  private initializeDefaultUsers(): void {
    this.defaultUsers = this.defaultUsers.map(user => ({
      ...user,
      password: this.hashPassword(user.password)
    }));
  }

  public static getInstance(): CSVManager {
    if (!CSVManager.instance) {
      CSVManager.instance = new CSVManager();
    }
    return CSVManager.instance;
  }

  // Load data from localStorage or use defaults
  private loadData(): void {
    try {
      const storedUsers = localStorage.getItem('havenx_users');
      const storedLogins = localStorage.getItem('havenx_login_records');
      const storedActivities = localStorage.getItem('havenx_user_activities');

      // Check if we need to reset to new default users (for Hindi names update)
      const shouldReset = !storedUsers || this.shouldResetToNewDefaults(storedUsers);
      
      if (shouldReset) {
        // Clear old data and use new defaults
        this.clearAllData();
        this.users = this.defaultUsers;
        this.loginRecords = [];
        this.userActivities = [];
        this.saveUsers();
        this.saveLoginRecords();
        this.saveUserActivities();
      } else {
        this.users = storedUsers ? JSON.parse(storedUsers) : this.defaultUsers;
        this.loginRecords = storedLogins ? JSON.parse(storedLogins) : [];
        this.userActivities = storedActivities ? JSON.parse(storedActivities) : [];
      }
    } catch (error) {
      console.error('Error loading CSV data:', error);
      this.users = this.defaultUsers;
      this.loginRecords = [];
      this.userActivities = [];
    }
  }

  // Check if we need to reset to new default users
  private shouldResetToNewDefaults(storedUsers: string): boolean {
    try {
      const users = JSON.parse(storedUsers);
      // Check if old default users exist (admin, analyst, viewer)
      const hasOldDefaults = users.some((user: User) => 
        user.username === 'admin' || user.username === 'analyst' || user.username === 'viewer'
      );
      // Check if new default users don't exist
      const hasNewDefaults = users.some((user: User) => 
        user.username === 'devv' || user.username === 'priyanshi'
      );
      return hasOldDefaults && !hasNewDefaults;
    } catch {
      return true; // Reset if parsing fails
    }
  }

  // Clear all data and reset to defaults
  public clearAllData(): void {
          localStorage.removeItem('havenx_users');
      localStorage.removeItem('havenx_login_records');
      localStorage.removeItem('havenx_user_activities');
      localStorage.removeItem('havenx_user'); // Clear logged in user
  }

  // Force reset to default users (for debugging/testing)
  public resetToDefaults(): void {
    this.clearAllData();
    this.users = this.defaultUsers;
    this.loginRecords = [];
    this.userActivities = [];
    this.saveUsers();
    this.saveLoginRecords();
    this.saveUserActivities();
  }

  // Save data to localStorage
  private saveUsers(): void {
    localStorage.setItem('havenx_users', JSON.stringify(this.users));
  }

  private saveLoginRecords(): void {
    localStorage.setItem('havenx_login_records', JSON.stringify(this.loginRecords));
  }

  private saveUserActivities(): void {
    localStorage.setItem('havenx_user_activities', JSON.stringify(this.userActivities));
  }

  // User Management Methods
  public getAllUsers(): User[] {
    return this.users;
  }

  public getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // Secure password methods
  private hashPassword(password: string): string {
    try {
      return bcrypt.hashSync(password, 10);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Password hashing failed');
    }
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    try {
      return bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Check if account is temporarily locked
  private isAccountLocked(user: User): boolean {
    if (!user.accountLockedUntil) return false;
    const lockTime = new Date(user.accountLockedUntil);
    const now = new Date();
    return now < lockTime;
  }

  // Lock account for specified duration (in minutes)
  private lockAccount(user: User, durationMinutes: number = 30): void {
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + durationMinutes);
    user.accountLockedUntil = lockUntil.toISOString();
    user.isActive = false;
    this.saveUsers();
    
    if (import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true') {
      toast.error(`Account locked for ${durationMinutes} minutes due to failed login attempts`);
    }
  }

  // Unlock account if lock period has expired
  private unlockAccountIfExpired(user: User): void {
    if (user.accountLockedUntil && !this.isAccountLocked(user)) {
      user.accountLockedUntil = undefined;
      user.isActive = true;
      user.failedLoginAttempts = 0;
      this.saveUsers();
    }
  }

  public authenticateUser(username: string, password: string): User | null {
    // Input validation
    if (!username || !password) {
      return null;
    }

    // Sanitize input
    const sanitizedUsername = sanitizeInput(username);
    
    // Check for malicious content
    if (containsMaliciousContent(username) || containsMaliciousContent(password)) {
      if (import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true') {
        toast.error('Invalid login attempt detected');
      }
      return null;
    }

    const user = this.getUserByUsername(sanitizedUsername);
    if (!user) {
      return null;
    }

    // Check if account is locked
    this.unlockAccountIfExpired(user);
    if (this.isAccountLocked(user)) {
      if (import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true') {
        toast.error('Account is temporarily locked. Please try again later.');
      }
      return null;
    }

    // For demo purposes, check if password is already hashed
    const isPasswordValid = user.password.startsWith('$2') 
      ? this.verifyPassword(password, user.password)
      : user.password === password; // Fallback for unhashed passwords

    if (isPasswordValid && user.isActive) {
      // Reset failed attempts on successful login
      user.failedLoginAttempts = 0;
      user.accountLockedUntil = undefined;
      this.saveUsers();
      return user;
    }

    // Handle failed login
    user.failedLoginAttempts += 1;
    const maxAttempts = Number(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5;
    
    if (user.failedLoginAttempts >= maxAttempts) {
      this.lockAccount(user, 30); // Lock for 30 minutes
    } else {
      this.saveUsers();
      const remainingAttempts = maxAttempts - user.failedLoginAttempts;
      if (import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true') {
        toast.error(`Invalid credentials. ${remainingAttempts} attempts remaining.`);
      }
    }

    return null;
  }

  public addUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'failedLoginAttempts' | 'lastPasswordChange'>): User {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastLogin: '',
      failedLoginAttempts: 0,
      lastPasswordChange: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      this.saveUsers();
      return this.users[userIndex];
    }
    return null;
  }

  public deleteUser(id: string): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      this.saveUsers();
      return true;
    }
    return false;
  }

  public updateLastLogin(userId: string): void {
    const user = this.getUserById(userId);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.saveUsers();
    }
  }

  public incrementFailedLoginAttempts(username: string): void {
    const user = this.getUserByUsername(username);
    if (user) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.isActive = false; // Lock account after 5 failed attempts
      }
      this.saveUsers();
    }
  }

  public resetFailedLoginAttempts(username: string): void {
    const user = this.getUserByUsername(username);
    if (user) {
      user.failedLoginAttempts = 0;
      this.saveUsers();
    }
  }

  // Login Record Methods
  public addLoginRecord(record: Omit<LoginRecord, 'id'>): LoginRecord {
    const newRecord: LoginRecord = {
      ...record,
      id: Date.now().toString()
    };

    this.loginRecords.push(newRecord);
    this.saveLoginRecords();
    return newRecord;
  }

  public getLoginRecords(userId?: string): LoginRecord[] {
    if (userId) {
      return this.loginRecords.filter(record => record.userId === userId);
    }
    return this.loginRecords;
  }

  public getRecentLoginRecords(limit: number = 50): LoginRecord[] {
    return this.loginRecords
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  public getFailedLoginRecords(): LoginRecord[] {
    return this.loginRecords.filter(record => record.status === 'failed');
  }

  // User Activity Methods
  public addUserActivity(activity: Omit<UserActivity, 'id'>): UserActivity {
    const newActivity: UserActivity = {
      ...activity,
      id: Date.now().toString()
    };

    this.userActivities.push(newActivity);
    this.saveUserActivities();
    return newActivity;
  }

  public getUserActivities(userId?: string): UserActivity[] {
    if (userId) {
      return this.userActivities.filter(activity => activity.userId === userId);
    }
    return this.userActivities;
  }

  public getRecentUserActivities(limit: number = 100): UserActivity[] {
    return this.userActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // CSV Export Methods
  public exportUsersToCSV(): string {
    const headers = [
      'ID', 'Username', 'Name', 'Email', 'Role', 'Department', 
      'Created At', 'Last Login', 'Is Active', 'Security Score',
      'Failed Login Attempts', 'Last Password Change', '2FA Enabled'
    ];

    const rows = this.users.map(user => [
      user.id,
      user.username,
      user.name,
      user.email,
      user.role,
      user.department,
      user.createdAt,
      user.lastLogin,
      user.isActive ? 'Yes' : 'No',
      user.securityScore.toString(),
      user.failedLoginAttempts.toString(),
      user.lastPasswordChange,
      user.twoFactorEnabled ? 'Yes' : 'No'
    ]);

    return this.convertToCSV([headers, ...rows]);
  }

  public exportLoginRecordsToCSV(): string {
    const headers = [
      'ID', 'User ID', 'Username', 'Timestamp', 'IP Address', 
      'User Agent', 'Location', 'Device', 'Status', 'Risk Level',
      'Session Duration', 'Logout Time', 'Notes'
    ];

    const rows = this.loginRecords.map(record => [
      record.id,
      record.userId,
      record.username,
      record.timestamp,
      record.ipAddress,
      record.userAgent,
      record.location,
      record.device,
      record.status,
      record.riskLevel,
      record.sessionDuration?.toString() || '',
      record.logoutTime || '',
      record.notes || ''
    ]);

    return this.convertToCSV([headers, ...rows]);
  }

  public exportUserActivitiesToCSV(): string {
    const headers = [
      'ID', 'User ID', 'Username', 'Action', 'Timestamp', 
      'Resource', 'IP Address', 'Device', 'Risk Level', 'Details'
    ];

    const rows = this.userActivities.map(activity => [
      activity.id,
      activity.userId,
      activity.username,
      activity.action,
      activity.timestamp,
      activity.resource,
      activity.ipAddress,
      activity.device,
      activity.riskLevel,
      activity.details || ''
    ]);

    return this.convertToCSV([headers, ...rows]);
  }

  // CSV Import Methods
  public importUsersFromCSV(csvData: string): { success: number; errors: string[] } {
    const lines = csvData.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    let successCount = 0;

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        if (values.length >= 13) {
          const user: User = {
            id: values[0],
            username: values[1],
            password: 'default123', // Set default password for imported users
            name: values[2],
            email: values[3],
            role: values[4] as 'admin' | 'analyst' | 'viewer',
            department: values[5],
            createdAt: values[6],
            lastLogin: values[7],
            isActive: values[8] === 'Yes',
            securityScore: parseInt(values[9]) || 75,
            failedLoginAttempts: parseInt(values[10]) || 0,
            lastPasswordChange: values[11],
            twoFactorEnabled: values[12] === 'Yes'
          };

          // Check if user already exists
          const existingUser = this.getUserByUsername(user.username);
          if (!existingUser) {
            this.users.push(user);
            successCount++;
          } else {
            errors.push(`User ${user.username} already exists`);
          }
        }
      } catch (error) {
        errors.push(`Error parsing line ${i + 1}: ${error}`);
      }
    }

    if (successCount > 0) {
      this.saveUsers();
    }

    return { success: successCount, errors };
  }

  // Utility Methods
  private convertToCSV(rows: string[][]): string {
    return rows.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma or quote
        const escaped = cell.replace(/"/g, '""');
        return cell.includes(',') || cell.includes('"') || cell.includes('\n') 
          ? `"${escaped}"` 
          : escaped;
      }).join(',')
    ).join('\n');
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  // Analytics Methods
  public getLoginStatistics(): {
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    uniqueUsers: number;
    averageSecurityScore: number;
  } {
    const totalLogins = this.loginRecords.length;
    const successfulLogins = this.loginRecords.filter(r => r.status === 'success').length;
    const failedLogins = this.loginRecords.filter(r => r.status === 'failed').length;
    const uniqueUsers = new Set(this.loginRecords.map(r => r.userId)).size;
    const averageSecurityScore = this.users.length > 0 
      ? this.users.reduce((sum, user) => sum + user.securityScore, 0) / this.users.length 
      : 0;

    return {
      totalLogins,
      successfulLogins,
      failedLogins,
      uniqueUsers,
      averageSecurityScore: Math.round(averageSecurityScore)
    };
  }

  public getRiskAnalysis(): {
    highRiskUsers: User[];
    mediumRiskUsers: User[];
    lowRiskUsers: User[];
  } {
    const highRiskUsers = this.users.filter(user => user.securityScore < 60);
    const mediumRiskUsers = this.users.filter(user => user.securityScore >= 60 && user.securityScore < 80);
    const lowRiskUsers = this.users.filter(user => user.securityScore >= 80);

    return {
      highRiskUsers,
      mediumRiskUsers,
      lowRiskUsers
    };
  }
}

export default CSVManager; 