import React, { useState } from 'react';
import { format, isSameMonth, isSameDay, isToday, isWeekend } from 'date-fns';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import { getMonthDays, getTasksForDate } from '@/lib/calendar-utils';
import { CalendarTaskPill } from './CalendarTaskPill';
import { DayPopover } from './DayPopover';

interface MonthGridProps {
  cursorDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onQuickAdd: (title: string, date: Date) => void;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_TASKS = 3;

export const MonthGrid: React.FC<MonthGridProps> = ({
  cursorDate,
  tasks,
  onTaskClick,
  onQuickAdd,
}) => {
  const [openPopoverDate, setOpenPopoverDate] = useState<string | null>(null);
  const days = getMonthDays(cursorDate);

  return (
    <div className="flex flex-col h-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAY_LABELS.map((day, i) => (
          <div
            key={day}
            className={cn(
              'py-2 text-center text-sm font-medium',
              isWeekend(new Date(2024, 0, i)) && 'text-muted-foreground'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = getTasksForDate(dateKey, tasks);
          const isCurrentMonth = isSameMonth(day, cursorDate);
          const isSelected = openPopoverDate === dateKey;
          const visibleTasks = dayTasks.slice(0, MAX_VISIBLE_TASKS);
          const hiddenCount = dayTasks.length - MAX_VISIBLE_TASKS;

          return (
            <DayPopover
              key={dateKey}
              date={day}
              tasks={dayTasks}
              onTaskClick={onTaskClick}
              onQuickAdd={onQuickAdd}
              open={isSelected}
              onOpenChange={(open) => setOpenPopoverDate(open ? dateKey : null)}
            >
              <button
                className={cn(
                  'flex flex-col p-1 border-b border-r border-border text-left transition-colors min-h-24',
                  'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset',
                  !isCurrentMonth && 'bg-muted/30',
                  isWeekend(day) && isCurrentMonth && 'bg-muted/20',
                  isSelected && 'bg-accent'
                )}
              >
                {/* Day number */}
                <div
                  className={cn(
                    'w-7 h-7 flex items-center justify-center rounded-full text-sm mb-1',
                    isToday(day) && 'bg-primary text-primary-foreground font-semibold',
                    !isCurrentMonth && 'text-muted-foreground'
                  )}
                >
                  {format(day, 'd')}
                </div>

                {/* Tasks */}
                <div className="flex-1 space-y-0.5 overflow-hidden">
                  {visibleTasks.map((task) => (
                    <CalendarTaskPill
                      key={task.id}
                      task={task}
                      currentDate={day}
                      onClick={onTaskClick}
                      compact
                    />
                  ))}
                  
                  {/* "+N more" indicator */}
                  {hiddenCount > 0 && (
                    <div className="text-xs text-muted-foreground px-1 hover:text-foreground">
                      +{hiddenCount} more
                    </div>
                  )}
                </div>
              </button>
            </DayPopover>
          );
        })}
      </div>
    </div>
  );
};
