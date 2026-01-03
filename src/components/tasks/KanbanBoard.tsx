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
import { Badge } from '@/components/ui/badge';
import { GripVertical, MessageSquare, Paperclip, Clock } from 'lucide-react';
import { PresenceAvatar, getRandomStatus } from '@/components/common/PresenceAvatar';
import { InlineTaskAdd } from './InlineTaskAdd';
import { TaskQuickActions } from './TaskQuickActions';

interface KanbanBoardProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  selectedTaskId?: string;
  onTaskMove?: (taskId: string, newStatus: Task['status']) => void;
}

const columns: { id: Task['status']; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'bg-muted-foreground' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-primary' },
  { id: 'review', label: 'Review', color: 'bg-chart-3' },
  { id: 'done', label: 'Done', color: 'bg-green-500' },
];

const priorityColors = {
  low: 'bg-muted-foreground/60',
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

  // Mock data for demo
  const commentCount = Math.floor(Math.random() * 5);
  const hasAttachments = Math.random() > 0.6;
  const hasTimeLogged = task.loggedHours && task.loggedHours > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group cursor-pointer rounded-lg border border-border bg-card p-3 shadow-sm transition-all duration-150',
        'hover:shadow-md hover:border-primary/30',
        isSelected && 'ring-2 ring-primary border-primary',
        isDragging && 'opacity-50 shadow-lg rotate-1 scale-105'
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="flex h-5 w-5 shrink-0 items-center justify-center cursor-grab active:cursor-grabbing mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted rounded"
        >
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        
        <div className="flex-1 min-w-0">
          {/* Priority indicator + Quick Actions */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  priorityColors[task.priority]
                )}
              />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {task.priority}
              </span>
            </div>
            <TaskQuickActions compact className="opacity-0 group-hover:opacity-100" />
          </div>

          {/* Title */}
          <p className="text-sm font-medium leading-snug mb-2 line-clamp-2">
            {task.title}
          </p>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
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
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Footer - Meta info */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              {task.dueDate && (
                <span className="text-[10px] font-medium">
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
              {commentCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px]">
                  <MessageSquare className="h-3 w-3" />
                  {commentCount}
                </span>
              )}
              {hasAttachments && (
                <Paperclip className="h-3 w-3" />
              )}
              {hasTimeLogged && (
                <span className="flex items-center gap-0.5 text-[10px]">
                  <Clock className="h-3 w-3" />
                  {task.loggedHours}h
                </span>
              )}
            </div>
            
            {/* Assignees with presence */}
            <div className="flex -space-x-1.5">
              {task.assignees.slice(0, 2).map((user) => (
                <PresenceAvatar
                  key={user.id}
                  src={user.avatar}
                  name={user.name}
                  size="sm"
                  status={getRandomStatus(user.id)}
                />
              ))}
              {task.assignees.length > 2 && (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                  +{task.assignees.length - 2}
                </div>
              )}
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
    <div className="cursor-grabbing rounded-lg border border-primary bg-card p-3 shadow-xl rotate-2 scale-105">
      <div className="flex items-start gap-2">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className={cn(
                'h-2 w-2 rounded-full',
                priorityColors[task.priority]
              )}
            />
            <span className="text-[10px] text-muted-foreground uppercase">
              {task.priority}
            </span>
          </div>
          <p className="text-sm font-medium leading-snug">{task.title}</p>
        </div>
      </div>
    </div>
  );
};

// Droppable Column Component
const DroppableColumn: React.FC<{
  column: { id: Task['status']; label: string; color: string };
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  selectedTaskId?: string;
  isOver?: boolean;
  onAddTask?: (title: string) => void;
}> = ({ column, tasks, onSelectTask, selectedTaskId, isOver, onAddTask }) => {
  return (
    <div
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-lg bg-muted/30 transition-all duration-150',
        isOver && 'bg-primary/5 ring-2 ring-primary/30 ring-dashed'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', column.color)} />
          <h3 className="font-medium text-sm">{column.label}</h3>
        </div>
        <Badge variant="secondary" className="text-xs font-normal px-1.5 min-w-5 justify-center">
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

      {/* Inline Add Task */}
      <div className="border-t border-border/50">
        <InlineTaskAdd
          onAdd={(title) => {
            console.log(`Add task "${title}" to ${column.id}`);
            onAddTask?.(title);
          }}
          placeholder="Add a task..."
        />
      </div>
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
      <div className="flex gap-4 overflow-x-auto p-4 pb-6 h-full">
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
