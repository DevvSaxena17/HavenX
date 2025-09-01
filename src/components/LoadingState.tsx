import React from 'react';
import { Loader2, Shield } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'skeleton';
  fullScreen?: boolean;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  variant = 'spinner',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const SpinnerLoader = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} border-4 border-[#B0B0B0] border-t-[#FF3C3C] rounded-full animate-spin`}
        />
      </div>
      {message && (
        <p className={`text-white ${textSizeClasses[size]} text-center`}>
          {message}
        </p>
      )}
    </div>
  );

  const PulseLoader = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex space-x-2">
        <div 
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: '#FF3C3C', animationDelay: '0ms' }}
        />
        <div 
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: '#FF3C3C', animationDelay: '150ms' }}
        />
        <div 
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: '#FF3C3C', animationDelay: '300ms' }}
        />
      </div>
      {message && (
        <p className={`text-white ${textSizeClasses[size]} text-center`}>
          {message}
        </p>
      )}
    </div>
  );

  const SkeletonLoader = () => (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex items-center space-x-4">
        <div 
          className="w-12 h-12 rounded-full animate-pulse"
          style={{ backgroundColor: '#1A1A1A' }}
        />
        <div className="space-y-2 flex-1">
          <div 
            className="h-4 rounded animate-pulse"
            style={{ backgroundColor: '#1A1A1A' }}
          />
          <div 
            className="h-3 rounded animate-pulse w-3/4"
            style={{ backgroundColor: '#1A1A1A' }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div 
          className="h-4 rounded animate-pulse"
          style={{ backgroundColor: '#1A1A1A' }}
        />
        <div 
          className="h-4 rounded animate-pulse w-5/6"
          style={{ backgroundColor: '#1A1A1A' }}
        />
        <div 
          className="h-4 rounded animate-pulse w-4/6"
          style={{ backgroundColor: '#1A1A1A' }}
        />
      </div>
    </div>
  );

  const HavenXLoader = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Shield 
          className={`${sizeClasses[size]} text-[#FF3C3C] animate-pulse`}
        />
        <div 
          className="absolute inset-0 rounded-full border-2 border-[#FF3C3C] animate-ping opacity-20"
        />
      </div>
      {message && (
        <p className={`text-white ${textSizeClasses[size]} text-center`}>
          {message}
        </p>
      )}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'pulse':
        return <PulseLoader />;
      case 'skeleton':
        return <SkeletonLoader />;
      default:
        return message.toLowerCase().includes('havenx') ? <HavenXLoader /> : <SpinnerLoader />;
    }
  };

  const containerClasses = fullScreen
    ? `fixed inset-0 flex items-center justify-center z-50 ${className}`
    : `flex items-center justify-center p-4 ${className}`;

  const backgroundClasses = fullScreen
    ? 'bg-[#0D0D0D] bg-opacity-90 backdrop-blur-sm'
    : '';

  return (
    <div 
      className={`${containerClasses} ${backgroundClasses}`}
      style={{ backgroundColor: fullScreen ? 'rgba(13, 13, 13, 0.95)' : 'transparent' }}
    >
      {renderLoader()}
    </div>
  );
};

// Inline loading component for buttons
export const InlineLoader: React.FC<{ size?: 'sm' | 'md'; className?: string }> = ({
  size = 'sm',
  className = ''
}) => (
  <Loader2 
    className={`animate-spin ${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${className}`}
  />
);

// Loading overlay for specific components
export const LoadingOverlay: React.FC<{ 
  isLoading: boolean; 
  children: React.ReactNode;
  message?: string;
  variant?: 'spinner' | 'pulse' | 'skeleton';
}> = ({ 
  isLoading, 
  children, 
  message = 'Loading...',
  variant = 'spinner'
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingState message={message} variant={variant} size="md" />
      </div>
    </div>
  );
};

export default LoadingState;
