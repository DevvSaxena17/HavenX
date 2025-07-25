import React, { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Grid3X3, 
  Maximize2, 
  Minimize2, 
  Settings, 
  X, 
  GripVertical,
  Save,
  Download,
  Upload,
  Eye,
  BarChart3,
  Activity,
  AlertTriangle,
  Users,
  Shield,
  Clock,
  MapPin
} from 'lucide-react';

interface Widget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  isExpanded: boolean;
  data: any;
}

interface ModularWidgetsProps {
  userRole: string;
}

const ModularWidgets: React.FC<ModularWidgetsProps> = ({ userRole }) => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      type: 'threats',
      title: 'Live Threats',
      size: 'medium',
      position: 0,
      isExpanded: false,
      data: { count: 15, change: 12 }
    },
    {
      id: '2',
      type: 'users',
      title: 'Active Users',
      size: 'small',
      position: 1,
      isExpanded: false,
      data: { count: 1250, change: -5 }
    },
    {
      id: '3',
      type: 'security',
      title: 'Security Score',
      size: 'medium',
      position: 2,
      isExpanded: false,
      data: { score: 85, change: 8 }
    },
    {
      id: '4',
      type: 'activity',
      title: 'Recent Activity',
      size: 'large',
      position: 3,
      isExpanded: false,
      data: { events: 25, alerts: 8 }
    }
  ]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('default');
  const [showWidgetMenu, setShowWidgetMenu] = useState<string | null>(null);

  const availableWidgets = [
    { type: 'threats', title: 'Live Threats', icon: AlertTriangle, color: '#FF3C3C' },
    { type: 'users', title: 'Active Users', icon: Users, color: '#00BFFF' },
    { type: 'security', title: 'Security Score', icon: Shield, color: '#00FF00' },
    { type: 'activity', title: 'Recent Activity', icon: Activity, color: '#FFA500' },
    { type: 'logs', title: 'Access Logs', icon: Clock, color: '#9370DB' },
    { type: 'map', title: 'Geographic View', icon: MapPin, color: '#FF69B4' },
  ];

  const layoutTemplates = [
    { id: 'default', name: 'Default', description: 'Standard dashboard layout' },
    { id: 'compact', name: 'Compact', description: 'Dense widget arrangement' },
    { id: 'expanded', name: 'Expanded', description: 'Large widget layout' },
    { id: 'analytics', name: 'Analytics', description: 'Data-focused layout' },
  ];

  const handleReorder = (newOrder: Widget[]) => {
    setWidgets(newOrder.map((widget, index) => ({ ...widget, position: index })));
  };

  const toggleWidgetExpansion = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isExpanded: !widget.isExpanded }
        : widget
    ));
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
  };

  const addWidget = (widgetType: string) => {
    const widgetTemplate = availableWidgets.find(w => w.type === widgetType);
    if (!widgetTemplate) return;

    const newWidget: Widget = {
      id: Date.now().toString(),
      type: widgetType,
      title: widgetTemplate.title,
      size: 'medium',
      position: widgets.length,
      isExpanded: false,
      data: { count: Math.floor(Math.random() * 100), change: Math.floor(Math.random() * 20) - 10 }
    };

    setWidgets(prev => [...prev, newWidget]);
  };

  const saveLayout = () => {
    const layoutData = {
      name: selectedLayout,
      widgets: widgets,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('shadowhawk_layout', JSON.stringify(layoutData));
    alert('Layout saved successfully!');
  };

  const loadLayout = () => {
    const savedLayout = localStorage.getItem('shadowhawk_layout');
    if (savedLayout) {
      const layoutData = JSON.parse(savedLayout);
      setWidgets(layoutData.widgets);
      setSelectedLayout(layoutData.name);
    }
  };

  const exportLayout = () => {
    const layoutData = {
      name: selectedLayout,
      widgets: widgets,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(layoutData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shadowhawk-layout-${selectedLayout}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getWidgetSize = (size: string, isExpanded: boolean) => {
    if (isExpanded) return 'col-span-full row-span-2';
    
    switch (size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'medium': return 'col-span-2 row-span-1';
      case 'large': return 'col-span-2 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  const renderWidgetContent = (widget: Widget) => {
    const widgetTemplate = availableWidgets.find(w => w.type === widget.type);
    if (!widgetTemplate) return null;

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <widgetTemplate.icon className="h-5 w-5" style={{ color: widgetTemplate.color }} />
            <h3 className="text-white font-medium">{widget.title}</h3>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => toggleWidgetExpansion(widget.id)}
              className="p-1 rounded hover:bg-[#0D0D0D] transition-colors"
            >
              {widget.isExpanded ? (
                <Minimize2 className="h-4 w-4 text-[#B0B0B0]" />
              ) : (
                <Maximize2 className="h-4 w-4 text-[#B0B0B0]" />
              )}
            </button>
            {isEditMode && (
              <button
                onClick={() => removeWidget(widget.id)}
                className="p-1 rounded hover:bg-[#0D0D0D] transition-colors"
              >
                <X className="h-4 w-4 text-[#B0B0B0]" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {widget.data.count || widget.data.score || widget.data.events}
            </div>
            <div className="text-[#B0B0B0] text-sm">
              {widget.type === 'threats' && 'Active Threats'}
              {widget.type === 'users' && 'Online Users'}
              {widget.type === 'security' && 'Risk Score'}
              {widget.type === 'activity' && 'Recent Events'}
            </div>
            {widget.data.change !== undefined && (
              <div className={`text-sm mt-1 ${
                widget.data.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {widget.data.change > 0 ? '+' : ''}{widget.data.change}%
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Modular Dashboard</h2>
        <div className="flex items-center space-x-4">
          {/* Layout Selector */}
          <select
            value={selectedLayout}
            onChange={(e) => setSelectedLayout(e.target.value)}
            className="px-3 py-1 rounded border bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#FF3C3C]"
            style={{ borderColor: '#B0B0B0' }}
          >
            {layoutTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-1 rounded border transition-colors ${
                isEditMode 
                  ? 'bg-[#FF3C3C] text-white border-[#FF3C3C]' 
                  : 'bg-transparent text-[#B0B0B0] border-[#B0B0B0] hover:bg-[#1A1A1A]'
              }`}
            >
              {isEditMode ? 'Done' : 'Edit'}
            </button>
            
            {isEditMode && (
              <>
                <button
                  onClick={saveLayout}
                  className="px-3 py-1 rounded border bg-transparent text-[#B0B0B0] border-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={exportLayout}
                  className="px-3 py-1 rounded border bg-transparent text-[#B0B0B0] border-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={loadLayout}
                  className="px-3 py-1 rounded border bg-transparent text-[#B0B0B0] border-[#B0B0B0] hover:bg-[#1A1A1A] transition-colors"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Reorder.Group axis="y" values={widgets} onReorder={handleReorder} className="col-span-full">
          {widgets.map((widget) => (
            <Reorder.Item
              key={widget.id}
              value={widget}
              className={`${getWidgetSize(widget.size, widget.isExpanded)}`}
            >
              <motion.div
                layout
                className="h-full rounded-lg border p-4 relative"
                style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {isEditMode && (
                  <div className="absolute top-2 left-2 cursor-grab">
                    <GripVertical className="h-4 w-4 text-[#B0B0B0]" />
                  </div>
                )}
                {renderWidgetContent(widget)}
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {/* Widget Menu (Edit Mode) */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-6" 
          style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}
        >
          <h3 className="text-white font-medium mb-4">Add Widgets</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {availableWidgets.map((widget) => (
              <button
                key={widget.type}
                onClick={() => addWidget(widget.type)}
                className="p-4 rounded-lg border text-center transition-colors hover:bg-[#0D0D0D]"
                style={{ borderColor: '#B0B0B0' }}
              >
                <widget.icon className="h-6 w-6 mx-auto mb-2" style={{ color: widget.color }} />
                <p className="text-white text-sm">{widget.title}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Layout Templates */}
      <div className="rounded-lg border p-6" style={{ backgroundColor: '#1A1A1A', borderColor: '#B0B0B0' }}>
        <h3 className="text-white font-medium mb-4">Layout Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {layoutTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedLayout === template.id 
                  ? 'border-[#FF3C3C] bg-[#FF3C3C] bg-opacity-20' 
                  : 'border-[#B0B0B0] hover:bg-[#0D0D0D]'
              }`}
              onClick={() => setSelectedLayout(template.id)}
            >
              <h4 className="text-white font-medium mb-2">{template.name}</h4>
              <p className="text-[#B0B0B0] text-sm">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModularWidgets; 