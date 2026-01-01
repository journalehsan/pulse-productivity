import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Command, FileText, FolderOpen, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task, Project } from '@/types';
import { tasks, projects } from '@/data/mockData';
import { searchTasks, searchProjects, SearchResult } from '@/lib/search-utils';
import { cn } from '@/lib/utils';

interface GlobalSearchProps {
  onTaskSelect?: (task: Task) => void;
  onProjectSelect?: (project: Project) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onTaskSelect,
  onProjectSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const taskResults = searchTasks(query, tasks);
        const projectResults = searchProjects(query, projects);
        setResults([...projectResults, ...taskResults]);
        setSelectedIndex(0);
      } else {
        setResults([]);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  const handleSelect = useCallback((result: SearchResult) => {
    if (result.type === 'task') {
      onTaskSelect?.(result.item as Task);
    } else {
      onProjectSelect?.(result.item as Project);
    }
    setOpen(false);
  }, [onTaskSelect, onProjectSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
      case 'review':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-80 justify-start gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Search className="h-4 w-4" />
          <span>Search tasks, projects...</span>
          <kbd className="ml-auto hidden rounded border border-primary-foreground/30 bg-primary-foreground/10 px-1.5 py-0.5 text-xs font-mono sm:inline-block">
            <Command className="inline h-3 w-3" />K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search tasks, projects, people..."
              className="h-12 text-base pl-10 border-0 focus-visible:ring-0 bg-muted/50"
            />
          </div>
        </DialogHeader>

        <div className="border-t border-border">
          {query.trim() === '' ? (
            <div className="p-4">
              <div className="text-sm text-muted-foreground mb-3">Quick Tips</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">↑↓</kbd>
                  <span>Navigate results</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Enter</kbd>
                  <span>Open selected</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Esc</kbd>
                  <span>Close search</span>
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <div className="p-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.item.id}`}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors',
                      index === selectedIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    {result.type === 'task' ? (
                      <>
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">
                              {(result.item as Task).title}
                            </span>
                            <Badge
                              variant="secondary"
                              className={cn('text-xs', getStatusColor((result.item as Task).status))}
                            >
                              {(result.item as Task).status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground truncate">
                              {result.matchField !== 'title' && `Matched: ${result.matchField}`}
                            </span>
                            {(result.item as Task).dueDate && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {(result.item as Task).dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex -space-x-1">
                          {(result.item as Task).assignees.slice(0, 2).map((user) => (
                            <Avatar key={user.id} className="h-5 w-5 border border-background">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="text-[10px]">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {(result.item as Project).name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {(result.item as Project).description}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
