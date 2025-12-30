import React from 'react';
import { Search, Filter, SortAsc, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { users, tags } from '@/data/mockData';

interface FilterBarProps {
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onAssigneeChange?: (value: string) => void;
  onTagChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  activeFilters?: number;
  onClearFilters?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearchChange,
  onStatusChange,
  onAssigneeChange,
  onTagChange,
  onSortChange,
  activeFilters = 0,
  onClearFilters,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap px-4 py-2 border-b border-border bg-background">
      {/* Search */}
      <div className="relative flex-1 min-w-48 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filter tasks..."
          className="pl-8 h-8"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-32 h-8">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="backlog">Backlog</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      {/* Assignee Filter */}
      <Select onValueChange={onAssigneeChange}>
        <SelectTrigger className="w-36 h-8">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tags Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3 w-3" />
            Tags
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-1">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => onTagChange?.(tag.id)}
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Sort */}
      <Select onValueChange={onSortChange}>
        <SelectTrigger className="w-32 h-8">
          <div className="flex items-center gap-1">
            <SortAsc className="h-3 w-3" />
            <span>Sort</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="due_date">Due Date</SelectItem>
          <SelectItem value="created">Created</SelectItem>
          <SelectItem value="updated">Updated</SelectItem>
          <SelectItem value="title">Title A-Z</SelectItem>
        </SelectContent>
      </Select>

      {/* Active Filters Indicator */}
      {activeFilters > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1"
          onClick={onClearFilters}
        >
          <Badge variant="secondary" className="h-5 w-5 p-0 justify-center">
            {activeFilters}
          </Badge>
          <span>Clear</span>
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
