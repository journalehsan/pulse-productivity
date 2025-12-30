import React from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getTaskDayPosition } from '@/lib/calendar-utils';

interface CalendarTaskPillProps {
  task: Task;
  currentDate: Date;
  onClick: (task: Task) => void;
  compact?: boolean;
}

export const CalendarTaskPill: React.FC<CalendarTaskPillProps> = ({
  task,
  currentDate,
  onClick,
  compact = false,
}) => {
  const position = getTaskDayPosition(task, currentDate);
  const isMultiDay = position !== 'single';
  const primaryTag = task.tags[0];
  const primaryAssignee = task.assignees[0];

  const statusColors: Record<Task['status'], string> = {
    backlog: 'bg-muted text-muted-foreground',
    in_progress: 'bg-primary/10 text-primary border-primary/30',
    review: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    done: 'bg-green-500/10 text-green-600 border-green-500/30',
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(task);
      }}
      className={cn(
        'group w-full text-left text-xs font-medium px-1.5 py-0.5 rounded border transition-all hover:shadow-sm',
        statusColors[task.status],
        isMultiDay && position === 'start' && 'rounded-r-none border-r-0',
        isMultiDay && position === 'middle' && 'rounded-none border-x-0',
        isMultiDay && position === 'end' && 'rounded-l-none border-l-0',
        compact ? 'py-0' : 'py-0.5'
      )}
    >
      <div className="flex items-center gap-1 min-w-0">
        {/* Tag color dot */}
        {primaryTag && position !== 'middle' && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: primaryTag.color }}
          />
        )}
        
        {/* Task title */}
        <span className={cn(
          'truncate flex-1',
          position === 'middle' && 'opacity-50'
        )}>
          {position === 'middle' ? '…' : task.title}
        </span>
        
        {/* Assignee avatar (only on start/single) */}
        {!compact && primaryAssignee && (position === 'single' || position === 'end') && (
          <Avatar className="h-4 w-4 flex-shrink-0">
            <AvatarImage src={primaryAssignee.avatar} />
            <AvatarFallback className="text-[8px]">
              {primaryAssignee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </button>
  );
};
