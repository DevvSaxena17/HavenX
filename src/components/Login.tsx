import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading = false, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setFormErrors({});
    
    // Validation
    const errors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF3C3C' }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">ShadowHawk</span>
          </div>
          <p className="text-[#B0B0B0] text-lg">Enterprise Security Center</p>
          <p className="text-[#B0B0B0] text-sm mt-2">Insider Threat Detection System</p>
        </div>

        {/* Login Form */}
        <div className="rounded-lg p-8 border" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 rounded border" style={{ backgroundColor: '#FF3C3C', borderColor: '#FF3C3C', opacity: 0.1 }}>
              <p className="text-[#FF3C3C] text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-[#B0B0B0] text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#B0B0B0]" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 pr-3 py-3 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C] transition-colors ${
                    formErrors.username ? 'border-[#FF3C3C]' : 'border-[#B0B0B0]'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {formErrors.username && (
                <p className="text-[#FF3C3C] text-sm mt-1">{formErrors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[#B0B0B0] text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#B0B0B0]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C] transition-colors ${
                    formErrors.password ? 'border-[#FF3C3C]' : 'border-[#B0B0B0]'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#B0B0B0] hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#B0B0B0] hover:text-white transition-colors" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-[#FF3C3C] text-sm mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-[#B0B0B0] text-[#FF3C3C] focus:ring-[#FF3C3C] bg-transparent"
                />
                <span className="text-[#B0B0B0] text-sm ml-2">Remember me</span>
              </label>
              <button
                type="button"
                className="text-[#FF3C3C] text-sm hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-[#B0B0B0] text-[#1A1A1A] cursor-not-allowed'
                  : 'bg-[#FF3C3C] text-white hover:bg-[#D10000] focus:ring-2 focus:ring-[#FF3C3C] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]'
              }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[#B0B0B0] text-sm">
              Secure access to ShadowHawk Security Dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 