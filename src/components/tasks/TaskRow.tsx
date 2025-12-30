import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, GripVertical, Calendar } from 'lucide-react';
import { Task } from '@/types';
import { format } from 'date-fns';

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
  medium: { label: 'Med', className: 'bg-chart-5 text-foreground' },
  high: { label: 'High', className: 'bg-chart-1 text-foreground' },
  urgent: { label: 'Urgent', className: 'bg-destructive text-destructive-foreground' },
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
  return (
    <div
      className={cn(
        'group flex items-center gap-2 border-b border-border px-3 py-2 transition-colors hover:bg-accent/50 cursor-pointer',
        isSelected && 'bg-accent'
      )}
      style={{ paddingLeft: `${level * 24 + 12}px` }}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50 opacity-0 group-hover:opacity-100 cursor-grab" />

      {/* Expand/Collapse */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand?.();
        }}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-muted',
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
          'flex-1 truncate text-sm',
          task.status === 'done' && 'text-muted-foreground line-through'
        )}
      >
        {task.title}
      </span>

      {/* Tags */}
      <div className="hidden md:flex items-center gap-1">
        {task.tags.slice(0, 2).map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="text-xs px-1.5 py-0"
            style={{ borderColor: tag.color, color: tag.color }}
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* Priority */}
      <Badge
        variant="secondary"
        className={cn('text-xs px-1.5 py-0 hidden sm:inline-flex', priorityConfig[task.priority].className)}
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

      {/* Assignees */}
      <div className="flex -space-x-1">
        {task.assignees.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
};
