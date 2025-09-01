import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin } from 'lucide-react';
import TimeUtils, { TimeInfo } from '../utils/timeUtils';

interface LiveClockProps {
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  showDate?: boolean;
  showDay?: boolean;
  showTimezone?: boolean;
  className?: string;
}

const LiveClock: React.FC<LiveClockProps> = ({
  variant = 'default',
  showDate = true,
  showDay = true,
  showTimezone = true,
  className = ''
}) => {
  const [timeInfo, setTimeInfo] = useState<TimeInfo>(TimeUtils.getInstance().getCurrentTimeInfo());

  useEffect(() => {
    const timeUtils = TimeUtils.getInstance();
    
    // Update every second
    const interval = setInterval(() => {
      setTimeInfo(timeUtils.getCurrentTimeInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderDefault = () => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-blue-500" />
        <span className="text-white font-mono text-lg">
          {timeInfo.formattedTime}
        </span>
      </div>
      {showDate && (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-green-500" />
          <span className="text-gray-300 text-sm">
            {timeInfo.dayOfWeekShort}, {timeInfo.formattedDate}
          </span>
        </div>
      )}
      {showTimezone && (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-purple-500" />
          <span className="text-gray-400 text-xs">
            {timeInfo.timezone}
          </span>
        </div>
      )}
    </div>
  );

  const renderCompact = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className="h-4 w-4 text-blue-500" />
      <div className="text-white">
        <div className="font-mono text-sm">{timeInfo.formattedTime}</div>
        {showDate && (
          <div className="text-gray-400 text-xs">
            {timeInfo.dayOfWeekShort}, {timeInfo.formattedDate}
          </div>
        )}
      </div>
    </div>
  );

  const renderDetailed = () => (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className="text-white font-mono text-xl">
            {timeInfo.formattedTime}
          </span>
        </div>
        {showTimezone && (
          <span className="text-gray-400 text-sm">
            {timeInfo.timezone}
          </span>
        )}
      </div>
      {showDate && (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-green-500" />
          <span className="text-gray-300">
            {timeInfo.dayOfWeek}, {timeUtils.formatDateLong(timeInfo.currentTime)}
          </span>
        </div>
      )}
      <div className="text-gray-400 text-xs">
        Week {timeUtils.getWeekNumber(timeInfo.currentTime)} • Q{timeUtils.getQuarter(timeInfo.currentTime)}
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className="h-3 w-3 text-blue-500" />
      <span className="text-white font-mono text-sm">
        {timeInfo.formattedTime}
      </span>
    </div>
  );

  const timeUtils = TimeUtils.getInstance();

  switch (variant) {
    case 'compact':
      return renderCompact();
    case 'detailed':
      return renderDetailed();
    case 'minimal':
      return renderMinimal();
    default:
      return renderDefault();
  }
};

export default LiveClock; 