import React from 'react';
import { User, Calendar, MessageSquare, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TaskQuickActionsProps {
  onAssign?: () => void;
  onSetDueDate?: () => void;
  onComment?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  className?: string;
  compact?: boolean;
}

export const TaskQuickActions: React.FC<TaskQuickActionsProps> = ({
  onAssign,
  onSetDueDate,
  onComment,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  className,
  compact = false,
}) => {
  const handleClick = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-6 w-6', className)}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={(e) => handleClick(e, onAssign)}>
            <User className="h-4 w-4 mr-2" />
            Assign
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleClick(e, onSetDueDate)}>
            <Calendar className="h-4 w-4 mr-2" />
            Set Due Date
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleClick(e, onComment)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Comment
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => handleClick(e, onEdit)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleClick(e, onDuplicate)}>
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleClick(e, onArchive)}>
            Archive
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => handleClick(e, onDelete)}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity',
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => handleClick(e, onAssign)}
          >
            <User className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Assign</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => handleClick(e, onSetDueDate)}
          >
            <Calendar className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Due Date</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => handleClick(e, onComment)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Comment</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={(e) => handleClick(e, onEdit)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleClick(e, onDuplicate)}>
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleClick(e, onArchive)}>
            Archive
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => handleClick(e, onDelete)}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
