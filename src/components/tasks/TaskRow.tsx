import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, GripVertical, Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Task } from '@/types';
import { format } from 'date-fns';
import { PresenceAvatar, getRandomStatus } from '@/components/common/PresenceAvatar';
import { TaskQuickActions } from './TaskQuickActions';

interface TaskRowProps {
  task: Task;
  level?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onSelect?: () => void;
  onComplete?: () => void;
  isSelected?: boolean;
  hasChildren?: boolean;
}

const priorityConfig = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Med', className: 'bg-chart-5/20 text-chart-5 border-chart-5/30' },
  high: { label: 'High', className: 'bg-chart-1/20 text-chart-1 border-chart-1/30' },
  urgent: { label: 'Urgent', className: 'bg-destructive/20 text-destructive border-destructive/30' },
};

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  level = 0,
  isExpanded = false,
  onToggleExpand,
  onSelect,
  onComplete,
  isSelected = false,
  hasChildren = false,
}) => {
  // Mock data for demo
  const commentCount = Math.floor(Math.random() * 5);
  const hasAttachments = Math.random() > 0.6;

  return (
    <div
      className={cn(
        'group flex items-center gap-2 border-b border-border/50 px-3 py-2 transition-all duration-150',
        'hover:bg-muted/50 cursor-pointer',
        isSelected && 'bg-primary/5 border-primary/20'
      )}
      style={{ paddingLeft: `${level * 24 + 12}px` }}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity" />

      {/* Expand/Collapse */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand?.();
        }}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-muted transition-colors',
          !hasChildren && 'invisible'
        )}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Checkbox */}
      <Checkbox
        checked={task.status === 'done'}
        onCheckedChange={(e) => {
          e;
          onComplete?.();
        }}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />

      {/* Title */}
      <span
        className={cn(
          'flex-1 truncate text-sm font-medium',
          task.status === 'done' && 'text-muted-foreground line-through'
        )}
      >
        {task.title}
      </span>

      {/* Meta indicators - shown on larger screens */}
      <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
        {commentCount > 0 && (
          <span className="flex items-center gap-0.5 text-xs">
            <MessageSquare className="h-3 w-3" />
            {commentCount}
          </span>
        )}
        {hasAttachments && <Paperclip className="h-3 w-3" />}
      </div>

      {/* Tags */}
      <div className="hidden lg:flex items-center gap-1">
        {task.tags.slice(0, 2).map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="text-[10px] px-1.5 py-0 font-normal"
            style={{ borderColor: tag.color, color: tag.color }}
          >
            {tag.name}
          </Badge>
        ))}
        {task.tags.length > 2 && (
          <Badge variant="secondary" className="text-[10px] px-1 py-0">
            +{task.tags.length - 2}
          </Badge>
        )}
      </div>

      {/* Priority */}
      <Badge
        variant="outline"
        className={cn('text-[10px] px-1.5 py-0 hidden sm:inline-flex font-normal', priorityConfig[task.priority].className)}
      >
        {priorityConfig[task.priority].label}
      </Badge>

      {/* Due Date */}
      {task.dueDate && (
        <div className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {format(new Date(task.dueDate), 'MMM d')}
        </div>
      )}

      {/* Assignees with presence */}
      <div className="flex -space-x-1.5">
        {task.assignees.slice(0, 3).map((user) => (
          <PresenceAvatar
            key={user.id}
            src={user.avatar}
            name={user.name}
            size="sm"
            status={getRandomStatus(user.id)}
          />
        ))}
        {task.assignees.length > 3 && (
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
            +{task.assignees.length - 3}
          </div>
        )}
      </div>

      {/* Quick Actions on Hover */}
      <TaskQuickActions
        onEdit={() => console.log('Edit', task.id)}
        onDelete={() => console.log('Delete', task.id)}
        compact
        className="opacity-0 group-hover:opacity-100"
      />
    </div>
  );
};
