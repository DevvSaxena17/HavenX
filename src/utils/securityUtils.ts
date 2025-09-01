/**
 * Security utilities for HavenX application
 */

// XSS Protection
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// CSRF Token Management
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Secure local storage with encryption
class SecureStorage {
  private key: string;

  constructor() {
    this.key = this.getOrCreateKey();
  }

  private getOrCreateKey(): string {
    let key = localStorage.getItem('havenx_key');
    if (!key) {
      key = this.generateKey();
      localStorage.setItem('havenx_key', key);
    }
    return key;
  }

  private generateKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  private encrypt(data: string): string {
    // Simple XOR encryption for demo (use proper encryption in production)
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length)
      );
    }
    return btoa(result);
  }

  private decrypt(encryptedData: string): string {
    const data = atob(encryptedData);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length)
      );
    }
    return result;
  }

  setItem(key: string, value: string): void {
    const encrypted = this.encrypt(value);
    localStorage.setItem(`havenx_secure_${key}`, encrypted);
  }

  getItem(key: string): string | null {
    const encrypted = localStorage.getItem(`havenx_secure_${key}`);
    if (!encrypted) return null;
    
    try {
      return this.decrypt(encrypted);
    } catch {
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(`havenx_secure_${key}`);
  }
}

export const secureStorage = new SecureStorage();

// Session Security
export const validateSession = (): boolean => {
  const sessionData = secureStorage.getItem('session');
  if (!sessionData) return false;

  try {
    const session = JSON.parse(sessionData);
    const now = Date.now();
    const sessionAge = now - session.created;
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours

    return sessionAge < maxAge && session.valid === true;
  } catch {
    return false;
  }
};

// Device Fingerprinting
export const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Device fingerprint test', 2, 2);

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.deviceMemory || 'unknown'
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(16);
};

// Rate limiting for API calls
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Content Security Policy helpers
export const setupCSP = (): void => {
  // Add nonce to script tags for CSP
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (!script.nonce) {
      script.nonce = generateCSRFToken();
    }
  });
};

// Security event logging
export const logSecurityEvent = (event: {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: any;
}): void => {
  const securityLog = {
    ...event,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    deviceFingerprint: generateDeviceFingerprint()
  };

  // Store in secure storage
  const existingLogs = secureStorage.getItem('security_logs');
  const logs = existingLogs ? JSON.parse(existingLogs) : [];
  logs.push(securityLog);

  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.splice(0, logs.length - 100);
  }

  secureStorage.setItem('security_logs', JSON.stringify(logs));

  // Send critical events immediately
  if (event.severity === 'critical') {
    console.error('Critical security event:', securityLog);
    // In production, send to security monitoring service
  }
};
