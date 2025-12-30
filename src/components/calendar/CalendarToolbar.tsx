import React from 'react';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CalendarViewMode, CalendarFilters } from '@/lib/calendar-utils';
import { users, tags } from '@/data/mockData';

interface CalendarToolbarProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  title: string;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
}

const statusOptions = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  viewMode,
  onViewModeChange,
  title,
  onNavigate,
  onToday,
  filters,
  onFiltersChange,
}) => {
  const activeFilterCount =
    filters.status.length +
    filters.assigneeIds.length +
    filters.tagIds.length;

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleAssigneeToggle = (userId: string) => {
    const newAssignees = filters.assigneeIds.includes(userId)
      ? filters.assigneeIds.filter((id) => id !== userId)
      : [...filters.assigneeIds, userId];
    onFiltersChange({ ...filters, assigneeIds: newAssignees });
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = filters.tagIds.includes(tagId)
      ? filters.tagIds.filter((id) => id !== tagId)
      : [...filters.tagIds, tagId];
    onFiltersChange({ ...filters, tagIds: newTags });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: filters.search,
      status: [],
      assigneeIds: [],
      tagIds: [],
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-border">
      {/* Left: Navigation */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onNavigate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onNavigate('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <h2 className="text-lg font-semibold ml-2">{title}</h2>
      </div>

      {/* Right: View toggle, Search, Filters */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* View Toggle */}
        <div className="flex items-center border border-border rounded-md">
          <Toggle
            pressed={viewMode === 'month'}
            onPressedChange={() => onViewModeChange('month')}
            size="sm"
            className="rounded-r-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Month
          </Toggle>
          <Toggle
            pressed={viewMode === 'week'}
            onPressedChange={() => onViewModeChange('week')}
            size="sm"
            className="rounded-l-none border-l data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Week
          </Toggle>
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8 h-8 w-full sm:w-48"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>

        {/* Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {statusOptions.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={filters.status.includes(status.value)}
                onCheckedChange={() => handleStatusToggle(status.value)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Assignees</DropdownMenuLabel>
            {users.map((user) => (
              <DropdownMenuCheckboxItem
                key={user.id}
                checked={filters.assigneeIds.includes(user.id)}
                onCheckedChange={() => handleAssigneeToggle(user.id)}
              >
                {user.name}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Tags</DropdownMenuLabel>
            {tags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag.id}
                checked={filters.tagIds.includes(tag.id)}
                onCheckedChange={() => handleTagToggle(tag.id)}
              >
                <span
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </DropdownMenuCheckboxItem>
            ))}
            
            {activeFilterCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={false}
                  onCheckedChange={clearFilters}
                  className="text-destructive"
                >
                  Clear all filters
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
