import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, fallback }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || <div>Access denied. You don't have permission to view this page.</div>;
  }

  return <>{children}</>;
};

export default RoleGuard; 