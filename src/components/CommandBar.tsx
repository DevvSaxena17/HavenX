import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Users, 
  FileText, 
  Activity, 
  AlertTriangle, 
  Settings, 
  Brain,
  Command,
  ArrowUp,
  ArrowDown,
  X,
  Eye,
  Download,
  Shield,
  Clock,
  MapPin,
  Smartphone,
  Check
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
  keywords: string[];
}

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose, userRole }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredItems, setFilteredItems] = useState<CommandItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command items based on user role
  const getCommandItems = (): CommandItem[] => {
    const baseItems: CommandItem[] = [
      {
        id: 'search-users',
        title: 'Search Users',
        description: 'Find and manage user accounts',
        icon: Users,
        action: () => console.log('Search Users'),
        category: 'User Management',
        keywords: ['users', 'search', 'find', 'manage', 'accounts']
      },
      {
        id: 'view-logs',
        title: 'View Access Logs',
        description: 'Browse system access logs',
        icon: Activity,
        action: () => console.log('View Logs'),
        category: 'Monitoring',
        keywords: ['logs', 'access', 'history', 'activity', 'browse']
      },
      {
        id: 'download-report',
        title: 'Download Security Report',
        description: 'Export security report as PDF/CSV',
        icon: Download,
        action: () => console.log('Download Report'),
        category: 'Reports',
        keywords: ['download', 'export', 'report', 'pdf', 'csv', 'security']
      },
      {
        id: 'ai-insights',
        title: 'AI Security Insights',
        description: 'Get AI-powered security recommendations',
        icon: Brain,
        action: () => console.log('AI Insights'),
        category: 'AI',
        keywords: ['ai', 'insights', 'recommendations', 'security', 'analysis']
      }
    ];

    const adminItems: CommandItem[] = [
      {
        id: 'manage-users',
        title: 'Manage Users',
        description: 'Add, edit, or remove user accounts',
        icon: Users,
        action: () => console.log('Manage Users'),
        category: 'Admin',
        keywords: ['manage', 'users', 'add', 'edit', 'remove', 'accounts']
      },
      {
        id: 'system-settings',
        title: 'System Settings',
        description: 'Configure system security settings',
        icon: Settings,
        action: () => console.log('System Settings'),
        category: 'Admin',
        keywords: ['settings', 'configure', 'system', 'security', 'admin']
      },
      {
        id: 'threat-analysis',
        title: 'Threat Analysis',
        description: 'Analyze current security threats',
        icon: AlertTriangle,
        action: () => console.log('Threat Analysis'),
        category: 'Security',
        keywords: ['threat', 'analysis', 'security', 'alerts', 'monitoring']
      }
    ];

    const employeeItems: CommandItem[] = [
      {
        id: 'my-activity',
        title: 'My Activity',
        description: 'View your personal activity logs',
        icon: Activity,
        action: () => console.log('My Activity'),
        category: 'Personal',
        keywords: ['my', 'activity', 'logs', 'personal', 'history']
      },
      {
        id: 'security-score',
        title: 'Security Score',
        description: 'Check your personal security rating',
        icon: Shield,
        action: () => console.log('Security Score'),
        category: 'Personal',
        keywords: ['security', 'score', 'rating', 'personal', 'check']
      },
      {
        id: 'request-access',
        title: 'Request Access',
        description: 'Submit access request for sensitive data',
        icon: FileText,
        action: () => console.log('Request Access'),
        category: 'Access',
        keywords: ['request', 'access', 'submit', 'sensitive', 'data']
      }
    ];

    const internItems: CommandItem[] = [
      {
        id: 'basic-logs',
        title: 'Basic Logs',
        description: 'View your basic activity information',
        icon: Clock,
        action: () => console.log('Basic Logs'),
        category: 'Personal',
        keywords: ['basic', 'logs', 'activity', 'information', 'view']
      },
      {
        id: 'security-tips',
        title: 'Security Tips',
        description: 'Get security best practices',
        icon: Shield,
        action: () => console.log('Security Tips'),
        category: 'Help',
        keywords: ['security', 'tips', 'best', 'practices', 'help']
      },
      {
        id: 'contact-support',
        title: 'Contact Support',
        description: 'Get help from support team',
        icon: Users,
        action: () => console.log('Contact Support'),
        category: 'Help',
        keywords: ['contact', 'support', 'help', 'team', 'assistance']
      }
    ];

    let items = [...baseItems];

    if (userRole === 'admin') {
      items = [...items, ...adminItems];
    } else if (userRole === 'analyst') {
      items = [...items, ...employeeItems];
    } else if (userRole === 'viewer') {
      items = [...items, ...internItems];
    }

    return items;
  };

  // Filter items based on query
  useEffect(() => {
    const commandItems = getCommandItems();
    
    if (!query.trim()) {
      setFilteredItems(commandItems);
      setSelectedIndex(0);
      return;
    }

    const filtered = commandItems.filter(item => {
      const searchText = `${item.title} ${item.description} ${item.category} ${item.keywords.join(' ')}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    setFilteredItems(filtered);
    setSelectedIndex(0);
  }, [query, userRole]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Don't handle Enter key here as it's handled by the input field
      if (e.key === 'Enter') return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleItemClick = (item: CommandItem) => {
    item.action();
    onClose();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Admin': '#FF3C3C',
      'Security': '#FFA500',
      'Personal': '#00BFFF',
      'Access': '#00FF00',
      'Help': '#9370DB',
      'User Management': '#FF6B6B',
      'Monitoring': '#4ECDC4',
      'Reports': '#45B7D1',
      'AI': '#FF69B4'
    };
    return colors[category] || '#B0B0B0';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
              {/* Header */}
              <div className="p-4 border-b flex items-center space-x-3" style={{ borderColor: '#B0B0B0' }}>
                <Search className="h-5 w-5 text-[#B0B0B0]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredItems[selectedIndex]) {
                      e.preventDefault();
                      filteredItems[selectedIndex].action();
                      onClose();
                    }
                  }}
                  placeholder="Search commands, users, logs, reports..."
                  className="flex-1 bg-transparent text-white placeholder-[#B0B0B0] focus:outline-none"
                />
                <div className="flex items-center space-x-2 text-[#B0B0B0] text-sm">
                  <kbd className="px-2 py-1 rounded bg-[#0D0D0D] border" style={{ borderColor: '#B0B0B0' }}>
                    ↑↓
                  </kbd>
                  <span>navigate</span>
                  <kbd className="px-2 py-1 rounded bg-[#0D0D0D] border" style={{ borderColor: '#B0B0B0' }}>
                    ↵
                  </kbd>
                  <span>select</span>
                  <kbd className="px-2 py-1 rounded bg-[#0D0D0D] border" style={{ borderColor: '#B0B0B0' }}>
                    esc
                  </kbd>
                  <span>close</span>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-[#B0B0B0]">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No commands found for "{query}"</p>
                    <p className="text-sm mt-2">Try different keywords or browse categories</p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: '#B0B0B0' }}>
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 cursor-pointer transition-colors ${
                          index === selectedIndex 
                            ? 'bg-[#FF3C3C] bg-opacity-20' 
                            : 'hover:bg-[#0D0D0D]'
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${getCategoryColor(item.category)}20` }}
                          >
                            <item.icon className="h-5 w-5" style={{ color: getCategoryColor(item.category) }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-white font-medium">{item.title}</h3>
                              <span 
                                className="text-xs px-2 py-1 rounded"
                                style={{ 
                                  backgroundColor: `${getCategoryColor(item.category)}20`,
                                  color: getCategoryColor(item.category)
                                }}
                              >
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[#B0B0B0] text-sm mt-1">{item.description}</p>
                          </div>
                          {index === selectedIndex && (
                            <Check className="h-4 w-4 text-[#FF3C3C]" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t text-[#B0B0B0] text-sm" style={{ borderColor: '#B0B0B0' }}>
                <div className="flex items-center justify-between">
                  <span>{filteredItems.length} command{filteredItems.length !== 1 ? 's' : ''} available</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Command className="h-3 w-3" />
                      <span>Command Bar</span>
                    </span>
                    <span>Press ⌘K to open</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandBar; 