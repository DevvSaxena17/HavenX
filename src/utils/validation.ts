/**
 * Validation utilities for HavenX application
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Password validation with security requirements
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  const minLength = Number(import.meta.env.VITE_PASSWORD_MIN_LENGTH) || 6;

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    // Optional: Special character requirement
    // if (!/(?=.*[!@#$%^&*])/.test(password)) {
    //   errors.push('Password must contain at least one special character');
    // }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Username validation
 */
export const validateUsername = (username: string): ValidationResult => {
  const errors: string[] = [];

  if (!username) {
    errors.push('Username is required');
  } else {
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (username.length > 20) {
      errors.push('Username must not exceed 20 characters');
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.push('Email is required');
  } else {
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Name validation
 */
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];

  if (!name) {
    errors.push('Name is required');
  } else {
    if (name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (name.trim().length > 50) {
      errors.push('Name must not exceed 50 characters');
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errors.push('Name can only contain letters and spaces');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Department validation
 */
export const validateDepartment = (department: string): ValidationResult => {
  const validDepartments = ['IT', 'Security', 'Engineering', 'Marketing', 'HR', 'Finance', 'Operations'];
  const errors: string[] = [];

  if (!department) {
    errors.push('Department is required');
  } else {
    if (!validDepartments.includes(department)) {
      errors.push(`Department must be one of: ${validDepartments.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Role validation
 */
export const validateRole = (role: string): ValidationResult => {
  const validRoles = ['admin', 'analyst', 'viewer'];
  const errors: string[] = [];

  if (!role) {
    errors.push('Role is required');
  } else {
    if (!validRoles.includes(role)) {
      errors.push(`Role must be one of: ${validRoles.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Comprehensive form validation
 */
export const validateUserForm = (userData: {
  username: string;
  password?: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isEdit?: boolean;
}): ValidationResult => {
  const errors: string[] = [];

  // Validate each field
  const usernameResult = validateUsername(userData.username);
  const nameResult = validateName(userData.name);
  const emailResult = validateEmail(userData.email);
  const roleResult = validateRole(userData.role);
  const departmentResult = validateDepartment(userData.department);

  errors.push(...usernameResult.errors);
  errors.push(...nameResult.errors);
  errors.push(...emailResult.errors);
  errors.push(...roleResult.errors);
  errors.push(...departmentResult.errors);

  // Only validate password for new users or when password is being changed
  if (!userData.isEdit && userData.password !== undefined) {
    const passwordResult = validatePassword(userData.password);
    errors.push(...passwordResult.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Check if string contains potentially dangerous content
 */
export const containsMaliciousContent = (input: string): boolean => {
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
  ];

  return maliciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate file uploads
 */
export const validateFile = (file: File, allowedTypes: string[] = [], maxSize: number = 5 * 1024 * 1024): ValidationResult => {
  const errors: string[] = [];

  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }

  // Check file size (default 5MB)
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate validation summary
 */
export const getValidationSummary = (results: ValidationResult[]): ValidationResult => {
  const allErrors = results.reduce((acc, result) => [...acc, ...result.errors], [] as string[]);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};
