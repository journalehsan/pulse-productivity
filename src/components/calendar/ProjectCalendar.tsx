import React, { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { Plus, CalendarDays } from 'lucide-react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import {
  CalendarViewMode,
  CalendarFilters,
  formatMonthTitle,
  formatWeekTitle,
  navigateCalendar,
  filterTasks,
} from '@/lib/calendar-utils';
import { CalendarToolbar } from './CalendarToolbar';
import { MonthGrid } from './MonthGrid';
import { WeekGrid } from './WeekGrid';

interface ProjectCalendarProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onCreateTask?: (date?: Date) => void;
}

export const ProjectCalendar: React.FC<ProjectCalendarProps> = ({
  tasks,
  onTaskClick,
  onCreateTask,
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [cursorDate, setCursorDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState<CalendarFilters>({
    search: '',
    status: [],
    assigneeIds: [],
    tagIds: [],
  });
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  // Combine provided tasks with locally added tasks
  const allTasks = useMemo(() => [...tasks, ...localTasks], [tasks, localTasks]);
  
  // Filter tasks
  const filteredTasks = useMemo(
    () => filterTasks(allTasks, filters),
    [allTasks, filters]
  );

  // Tasks that have due dates (for calendar display)
  const calendarTasks = useMemo(
    () => filteredTasks.filter((t) => t.dueDate),
    [filteredTasks]
  );

  const title = useMemo(
    () =>
      viewMode === 'month'
        ? formatMonthTitle(cursorDate)
        : formatWeekTitle(cursorDate),
    [viewMode, cursorDate]
  );

  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      setCursorDate((prev) => navigateCalendar(prev, direction, viewMode));
    },
    [viewMode]
  );

  const handleToday = useCallback(() => {
    setCursorDate(new Date());
  }, []);

  const handleQuickAdd = useCallback((taskTitle: string, date: Date) => {
    const newTask: Task = {
      id: `temp-${Date.now()}`,
      title: taskTitle,
      status: 'backlog',
      priority: 'medium',
      assignees: [],
      dueDate: format(date, 'yyyy-MM-dd'),
      tags: [],
      projectId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalTasks((prev) => [...prev, newTask]);
  }, []);

  // Check if there are any tasks with dates
  const hasTasksWithDates = calendarTasks.length > 0;

  return (
    <div className="flex flex-col h-full">
      <CalendarToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        title={title}
        onNavigate={handleNavigate}
        onToday={handleToday}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="flex-1 overflow-hidden">
        {hasTasksWithDates || filters.search || filters.status.length > 0 ? (
          viewMode === 'month' ? (
            <MonthGrid
              cursorDate={cursorDate}
              tasks={calendarTasks}
              onTaskClick={onTaskClick}
              onQuickAdd={handleQuickAdd}
            />
          ) : (
            <WeekGrid
              cursorDate={cursorDate}
              tasks={calendarTasks}
              onTaskClick={onTaskClick}
              onQuickAdd={handleQuickAdd}
            />
          )
        ) : (
          // Empty state when no tasks have dates
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No scheduled tasks</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Tasks with due dates will appear here. Add due dates to your tasks or create a new scheduled task.
            </p>
            {onCreateTask && (
              <Button onClick={() => onCreateTask(cursorDate)}>
                <Plus className="h-4 w-4 mr-2" />
                Add task for {format(cursorDate, 'MMM d')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Floating create button (only in calendar view with tasks) */}
      {hasTasksWithDates && onCreateTask && (
        <Button
          onClick={() => onCreateTask(cursorDate)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
