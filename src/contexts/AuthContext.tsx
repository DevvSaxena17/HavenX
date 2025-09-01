import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CSVManager from '../utils/csvManager';
import RealTimeDataManager from '../utils/realTimeDataManager';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'analyst' | 'viewer';
  name: string;
  email: string;
  department: string;
  securityScore: number;
  lastLogin: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [csvManager] = useState(() => CSVManager.getInstance());
  const [realTimeManager] = useState(() => RealTimeDataManager.getInstance());
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('havenx_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (parseError) {
        console.error('Error parsing saved user data:', parseError);
        localStorage.removeItem('havenx_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Authenticate user using CSV manager
    const authenticatedUser = csvManager.authenticateUser(username, password);

    if (authenticatedUser) {
      // Check if account is locked
      if (!authenticatedUser.isActive) {
        setError('Account is locked due to multiple failed login attempts');
        setIsLoading(false);
        return false;
      }

      // Reset failed login attempts on successful login
      csvManager.resetFailedLoginAttempts(username);

      // Update last login time
      csvManager.updateLastLogin(authenticatedUser.id);

      // Add login record
      csvManager.addLoginRecord({
        userId: authenticatedUser.id,
        username: authenticatedUser.username,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100', // In real app, get from request
        userAgent: navigator.userAgent,
        location: 'Office',
        device: 'Desktop',
        status: 'success',
        riskLevel: 'low'
      });

      const userData: User = {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        role: authenticatedUser.role,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        department: authenticatedUser.department,
        securityScore: authenticatedUser.securityScore,
        lastLogin: authenticatedUser.lastLogin,
        isActive: authenticatedUser.isActive
      };

      // Start real-time session tracking
      const newSessionId = realTimeManager.startSession(userData);
      setSessionId(newSessionId);
      realTimeManager.setCurrentUser(userData);

      setUser(userData);
      localStorage.setItem('havenx_user', JSON.stringify(userData));
      localStorage.setItem('havenx_session_id', newSessionId);
      setIsLoading(false);
      return true;
    } else {
      // Increment failed login attempts
      csvManager.incrementFailedLoginAttempts(username);

      // Add failed login record
      csvManager.addLoginRecord({
        userId: 'unknown',
        username: username,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: navigator.userAgent,
        location: 'Office',
        device: 'Desktop',
        status: 'failed',
        riskLevel: 'high',
        notes: 'Invalid credentials'
      });

      setError('Invalid username or password');
      setIsLoading(false);
      return false;
    }
  };

  const refreshUser = () => {
    if (user) {
      const updatedUser = csvManager.getUserById(user.id);
      if (updatedUser) {
        const userData: User = {
          id: updatedUser.id,
          username: updatedUser.username,
          role: updatedUser.role,
          name: updatedUser.name,
          email: updatedUser.email,
          department: updatedUser.department,
          securityScore: updatedUser.securityScore,
          lastLogin: updatedUser.lastLogin,
          isActive: updatedUser.isActive
        };
        setUser(userData);
        localStorage.setItem('havenx_user', JSON.stringify(userData));
      }
    }
  };

  const logout = () => {
    // End real-time session tracking
    if (sessionId) {
      realTimeManager.endSession(sessionId);
      setSessionId(null);
    }

    setUser(null);
    setError(null);
    localStorage.removeItem('havenx_user');
    localStorage.removeItem('havenx_session_id');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 