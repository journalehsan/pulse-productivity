import React from 'react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  selectedTaskId?: string;
}

const columns: { id: Task['status']; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

const priorityColors = {
  low: 'bg-muted',
  medium: 'bg-chart-5',
  high: 'bg-chart-1',
  urgent: 'bg-destructive',
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onSelectTask,
  selectedTaskId,
}) => {
  // Flatten all tasks including subtasks for kanban view
  const flattenTasks = (taskList: Task[]): Task[] => {
    return taskList.reduce<Task[]>((acc, task) => {
      acc.push(task);
      if (task.subtasks) {
        acc.push(...flattenTasks(task.subtasks));
      }
      return acc;
    }, []);
  };

  const allTasks = flattenTasks(tasks);

  return (
    <div className="flex gap-4 overflow-x-auto p-4 h-full">
      {columns.map((column) => {
        const columnTasks = allTasks.filter((t) => t.status === column.id);
        return (
          <div
            key={column.id}
            className="flex w-72 shrink-0 flex-col rounded-lg bg-muted/50"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <h3 className="font-medium text-sm">{column.label}</h3>
              <Badge variant="secondary" className="text-xs">
                {columnTasks.length}
              </Badge>
            </div>

            {/* Column Content */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask?.(task)}
                  className={cn(
                    'group cursor-pointer rounded-md border border-border bg-card p-3 shadow-xs transition-all hover:shadow-sm',
                    selectedTaskId === task.id && 'ring-2 ring-ring'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50 opacity-0 group-hover:opacity-100 cursor-grab mt-0.5" />
                    <div className="flex-1 min-w-0">
                      {/* Priority indicator */}
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            priorityColors[task.priority]
                          )}
                        />
                        <span className="text-xs text-muted-foreground capitalize">
                          {task.priority}
                        </span>
                      </div>

                      {/* Title */}
                      <p className="text-sm font-medium leading-tight mb-2">
                        {task.title}
                      </p>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {task.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-[10px] px-1 py-0"
                              style={{ borderColor: tag.color, color: tag.color }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                        <div className="flex -space-x-1 ml-auto">
                          {task.assignees.slice(0, 2).map((user) => (
                            <Avatar
                              key={user.id}
                              className="h-5 w-5 border border-background"
                            >
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="text-[8px]">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
