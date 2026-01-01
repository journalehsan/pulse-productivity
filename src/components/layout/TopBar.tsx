import React, { useState } from 'react';
import { Search, Plus, Bell, HelpCircle, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ThemeToggle } from './ThemeToggle';
import { PulseTasksLogo } from './PulseTasksLogo';

interface TopBarProps {
  onCreateTask?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onCreateTask }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-primary-foreground/20 bg-primary px-4">
      {/* Logo and Search */}
      <div className="flex flex-1 items-center gap-4">
        <PulseTasksLogo className="h-6 w-auto text-primary-foreground" />
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-80 justify-start gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Search className="h-4 w-4" />
              <span>Search tasks, projects, users...</span>
              <kbd className="ml-auto hidden rounded border border-primary-foreground/30 bg-primary-foreground/10 px-1.5 py-0.5 text-xs font-mono sm:inline-block">
                <Command className="inline h-3 w-3" />K
              </kbd>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Search</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Type to search..."
                autoFocus
                className="h-12 text-base"
              />
              <div className="text-sm text-muted-foreground">
                <p className="mb-2 font-medium">Quick Tips</p>
                <ul className="space-y-1">
                  <li><kbd className="rounded border px-1">↑↓</kbd> Navigate results</li>
                  <li><kbd className="rounded border px-1">Enter</kbd> Open selected</li>
                  <li><kbd className="rounded border px-1">Esc</kbd> Close search</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
