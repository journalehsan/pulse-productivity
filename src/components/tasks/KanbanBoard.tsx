import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  selectedTaskId?: string;
  onTaskMove?: (taskId: string, newStatus: Task['status']) => void;
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

// Draggable Task Card Component
const SortableTaskCard: React.FC<{
  task: Task;
  onSelect?: () => void;
  isSelected?: boolean;
}> = ({ task, onSelect, isSelected }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group cursor-pointer rounded-md border border-border bg-card p-3 shadow-xs transition-all hover:shadow-sm',
        isSelected && 'ring-2 ring-ring',
        isDragging && 'opacity-50 shadow-lg rotate-2'
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="flex h-6 w-6 shrink-0 items-center justify-center cursor-grab active:cursor-grabbing mt-0.5 hover:bg-muted rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
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
  );
};

// Drag Overlay Card (shown while dragging)
const TaskCardOverlay: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div className="cursor-grabbing rounded-md border border-border bg-card p-3 shadow-lg rotate-3 scale-105">
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5" />
        <div className="flex-1 min-w-0">
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
          <p className="text-sm font-medium leading-tight">{task.title}</p>
        </div>
      </div>
    </div>
  );
};

// Droppable Column Component
const DroppableColumn: React.FC<{
  column: { id: Task['status']; label: string };
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  selectedTaskId?: string;
  isOver?: boolean;
}> = ({ column, tasks, onSelectTask, selectedTaskId, isOver }) => {
  return (
    <div
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-lg bg-muted/50 transition-colors',
        isOver && 'bg-accent/50 ring-2 ring-primary ring-dashed'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="font-medium text-sm">{column.label}</h3>
        <Badge variant="secondary" className="text-xs">
          {tasks.length}
        </Badge>
      </div>

      {/* Column Content */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-32">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onSelect={() => onSelectTask?.(task)}
              isSelected={selectedTaskId === task.id}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onSelectTask,
  selectedTaskId,
  onTaskMove,
}) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(() => flattenTasks(tasks));
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumn, setOverColumn] = useState<Task['status'] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = localTasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverColumn(null);
      return;
    }

    // Check if dragging over a column
    const columnId = columns.find((c) => c.id === over.id)?.id;
    if (columnId) {
      setOverColumn(columnId);
      return;
    }

    // Check if dragging over a task - get that task's column
    const overTask = localTasks.find((t) => t.id === over.id);
    if (overTask) {
      setOverColumn(overTask.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setOverColumn(null);

    if (!over) return;

    const activeTaskId = active.id as string;
    const activeTaskData = localTasks.find((t) => t.id === activeTaskId);
    if (!activeTaskData) return;

    // Determine target column
    let targetStatus: Task['status'] | undefined;

    // Check if dropped on a column
    const columnId = columns.find((c) => c.id === over.id)?.id;
    if (columnId) {
      targetStatus = columnId;
    } else {
      // Dropped on a task - get that task's column
      const overTask = localTasks.find((t) => t.id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (targetStatus && targetStatus !== activeTaskData.status) {
      // Update task status
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === activeTaskId ? { ...t, status: targetStatus } : t
        )
      );
      onTaskMove?.(activeTaskId, targetStatus);
    }
  };

  const getTasksByStatus = (status: Task['status']) =>
    localTasks.filter((t) => t.status === status);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto p-4 h-full">
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            onSelectTask={onSelectTask}
            selectedTaskId={selectedTaskId}
            isOver={overColumn === column.id}
          />
        ))}
      </div>

      {/* Drag Overlay - shows the dragged card */}
      <DragOverlay>
        {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
