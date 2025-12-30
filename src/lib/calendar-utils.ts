import { Task } from '@/types';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfDay,
  endOfDay,
} from 'date-fns';

export type CalendarViewMode = 'month' | 'week';

export interface CalendarFilters {
  search: string;
  status: string[];
  assigneeIds: string[];
  tagIds: string[];
}

// Get tasks for a specific date
export function getTasksForDate(dateISO: string, tasks: Task[]): Task[] {
  const targetDate = parseISO(dateISO);
  
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    
    const dueDate = parseISO(task.dueDate);
    const startDate = task.startDate ? parseISO(task.startDate) : null;
    
    // If task has both start and due date, check if target is within range
    if (startDate) {
      return isWithinInterval(targetDate, {
        start: startOfDay(startDate),
        end: endOfDay(dueDate),
      });
    }
    
    // Otherwise, just check due date
    return isSameDay(dueDate, targetDate);
  });
}

// Get tasks for a date range
export function getTasksForRange(startISO: string, endISO: string, tasks: Task[]): Task[] {
  const rangeStart = parseISO(startISO);
  const rangeEnd = parseISO(endISO);
  
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    
    const dueDate = parseISO(task.dueDate);
    const startDate = task.startDate ? parseISO(task.startDate) : dueDate;
    
    // Check if task overlaps with range
    return (
      isWithinInterval(dueDate, { start: rangeStart, end: rangeEnd }) ||
      isWithinInterval(startDate, { start: rangeStart, end: rangeEnd }) ||
      (startDate <= rangeStart && dueDate >= rangeEnd)
    );
  });
}

// Format month title
export function formatMonthTitle(date: Date): string {
  return format(date, 'MMMM yyyy');
}

// Format week range title
export function formatWeekTitle(date: Date): string {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  
  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'd, yyyy')}`;
  }
  return `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;
}

// Get calendar days for month view (includes padding days from prev/next month)
export function getMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

// Get week days
export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

// Navigation helpers
export function navigateCalendar(
  date: Date,
  direction: 'prev' | 'next',
  viewMode: CalendarViewMode
): Date {
  if (viewMode === 'month') {
    return direction === 'next' ? addMonths(date, 1) : subMonths(date, 1);
  }
  return direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1);
}

// Filter tasks based on calendar filters
export function filterTasks(tasks: Task[], filters: CalendarFilters): Task[] {
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }
    
    // Assignee filter
    if (filters.assigneeIds.length > 0) {
      const hasAssignee = task.assignees.some(a => filters.assigneeIds.includes(a.id));
      if (!hasAssignee) return false;
    }
    
    // Tag filter
    if (filters.tagIds.length > 0) {
      const hasTag = task.tags.some(t => filters.tagIds.includes(t.id));
      if (!hasTag) return false;
    }
    
    return true;
  });
}

// Check if a task spans multiple days
export function isMultiDayTask(task: Task): boolean {
  if (!task.startDate || !task.dueDate) return false;
  return !isSameDay(parseISO(task.startDate), parseISO(task.dueDate));
}

// Get task position info for multi-day rendering
export function getTaskDayPosition(
  task: Task,
  currentDate: Date
): 'start' | 'middle' | 'end' | 'single' {
  if (!task.dueDate) return 'single';
  
  const dueDate = parseISO(task.dueDate);
  const startDate = task.startDate ? parseISO(task.startDate) : dueDate;
  
  if (isSameDay(startDate, dueDate)) return 'single';
  if (isSameDay(currentDate, startDate)) return 'start';
  if (isSameDay(currentDate, dueDate)) return 'end';
  return 'middle';
}
