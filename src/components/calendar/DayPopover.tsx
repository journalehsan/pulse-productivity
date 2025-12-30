import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, X } from 'lucide-react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarTaskPill } from './CalendarTaskPill';

interface DayPopoverProps {
  date: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onQuickAdd: (title: string, date: Date) => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DayPopover: React.FC<DayPopoverProps> = ({
  date,
  tasks,
  onTaskClick,
  onQuickAdd,
  children,
  open,
  onOpenChange,
}) => {
  const [quickAddValue, setQuickAddValue] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAddValue.trim()) {
      onQuickAdd(quickAddValue.trim(), date);
      setQuickAddValue('');
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{format(date, 'EEEE, MMMM d')}</h3>
            <span className="text-xs text-muted-foreground">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <ScrollArea className="max-h-64">
          <div className="p-2 space-y-1">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tasks for this day
              </p>
            ) : (
              tasks.map((task) => (
                <CalendarTaskPill
                  key={task.id}
                  task={task}
                  currentDate={date}
                  onClick={onTaskClick}
                />
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-2 border-t border-border">
          <form onSubmit={handleQuickAdd} className="flex gap-2">
            <Input
              placeholder="Quick add task..."
              value={quickAddValue}
              onChange={(e) => setQuickAddValue(e.target.value)}
              className="h-8 text-sm"
            />
            <Button type="submit" size="sm" className="h-8 px-2">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};
