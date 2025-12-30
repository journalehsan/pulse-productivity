import React, { useState } from 'react';
import { format, isToday, isWeekend } from 'date-fns';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import { getWeekDays, getTasksForDate } from '@/lib/calendar-utils';
import { CalendarTaskPill } from './CalendarTaskPill';
import { DayPopover } from './DayPopover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WeekGridProps {
  cursorDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onQuickAdd: (title: string, date: Date) => void;
}

export const WeekGrid: React.FC<WeekGridProps> = ({
  cursorDate,
  tasks,
  onTaskClick,
  onQuickAdd,
}) => {
  const [openPopoverDate, setOpenPopoverDate] = useState<string | null>(null);
  const days = getWeekDays(cursorDate);

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          
          return (
            <div
              key={dateKey}
              className={cn(
                'p-3 text-center border-r border-border last:border-r-0',
                isWeekend(day) && 'bg-muted/30'
              )}
            >
              <div className="text-sm font-medium text-muted-foreground">
                {format(day, 'EEE')}
              </div>
              <div
                className={cn(
                  'w-10 h-10 mx-auto flex items-center justify-center rounded-full text-lg font-semibold mt-1',
                  isToday(day) && 'bg-primary text-primary-foreground'
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day columns with tasks */}
      <div className="flex-1 grid grid-cols-7">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = getTasksForDate(dateKey, tasks);
          const isSelected = openPopoverDate === dateKey;

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
                  'flex flex-col p-2 border-r border-border last:border-r-0 text-left transition-colors h-full min-h-[300px]',
                  'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset',
                  isWeekend(day) && 'bg-muted/20',
                  isSelected && 'bg-accent'
                )}
              >
                <ScrollArea className="flex-1 w-full">
                  <div className="space-y-1 pr-2">
                    {dayTasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No tasks
                      </p>
                    ) : (
                      dayTasks.map((task) => (
                        <CalendarTaskPill
                          key={task.id}
                          task={task}
                          currentDate={day}
                          onClick={onTaskClick}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </button>
            </DayPopover>
          );
        })}
      </div>
    </div>
  );
};
