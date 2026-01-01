import React from 'react';
import { Plus, Bell, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { PulseTasksLogo } from './PulseTasksLogo';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { Task, Project } from '@/types';

interface TopBarProps {
  onCreateTask?: () => void;
  onTaskSelect?: (task: Task) => void;
  onProjectSelect?: (project: Project) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onCreateTask, onTaskSelect, onProjectSelect }) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-primary-foreground/20 bg-primary px-4">
      {/* Logo and Search */}
      <div className="flex flex-1 items-center gap-4">
        <PulseTasksLogo className="h-6 w-auto text-primary-foreground" />
        <GlobalSearch onTaskSelect={onTaskSelect} onProjectSelect={onProjectSelect} />
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onCreateTask} className="gap-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Task</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary-foreground/10">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-4 w-4 p-0 text-[10px]"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium">Notifications</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start gap-1 py-3">
              <span className="font-medium">Task assigned to you</span>
              <span className="text-xs text-muted-foreground">
                Sarah assigned you to "Homepage redesign"
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-1 py-3">
              <span className="font-medium">Comment on your task</span>
              <span className="text-xs text-muted-foreground">
                Mike commented on "API integration"
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-1 py-3">
              <span className="font-medium">Due date reminder</span>
              <span className="text-xs text-muted-foreground">
                "User authentication flow" is due tomorrow
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggle className="text-primary-foreground hover:bg-primary-foreground/10" />

        {/* Help */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2 font-medium">Keyboard Shortcuts</div>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2 text-sm">
              <div className="flex justify-between">
                <span>Search</span>
                <kbd className="rounded border px-1.5 text-xs">⌘K</kbd>
              </div>
              <div className="flex justify-between">
                <span>New Task</span>
                <kbd className="rounded border px-1.5 text-xs">N</kbd>
              </div>
              <div className="flex justify-between">
                <span>Toggle Sidebar</span>
                <kbd className="rounded border px-1.5 text-xs">[</kbd>
              </div>
              <div className="flex justify-between">
                <span>Go to Dashboard</span>
                <kbd className="rounded border px-1.5 text-xs">G D</kbd>
              </div>
              <div className="flex justify-between">
                <span>Go to Projects</span>
                <kbd className="rounded border px-1.5 text-xs">G P</kbd>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
