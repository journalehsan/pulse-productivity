import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Calendar,
  User,
  Tag,
  Flag,
  Clock,
  FolderKanban,
  ChevronDown,
  Sparkles,
  ListTodo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
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
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { projects, users, tags } from '@/data/mockData';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectId?: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-muted text-muted-foreground' },
  { value: 'medium', label: 'Medium', color: 'bg-chart-5 text-foreground' },
  { value: 'high', label: 'High', color: 'bg-chart-1 text-foreground' },
  { value: 'urgent', label: 'Urgent', color: 'bg-destructive text-destructive-foreground' },
];

const statusOptions = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onOpenChange,
  defaultProjectId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('backlog');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [estimatedHours, setEstimatedHours] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setProjectId(defaultProjectId || '');
    }
  }, [open, defaultProjectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    // In a real app, this would call an API
    const newTask = {
      title: title.trim(),
      description: description.trim(),
      projectId,
      priority,
      status,
      assignees: selectedAssignees,
      tags: selectedTags,
      dueDate: dueDate?.toISOString(),
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      subtasks,
    };
    
    console.log('Creating task:', newTask);
    toast.success('Task created successfully!');
    
    // Reset form
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('backlog');
    setSelectedAssignees([]);
    setSelectedTags([]);
    setDueDate(undefined);
    setEstimatedHours('');
    setSubtasks([]);
    setNewSubtask('');
    setShowAdvanced(false);
  };

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks((prev) => [
        ...prev,
        { id: `subtask-${Date.now()}`, title: newSubtask.trim(), completed: false },
      ]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const selectedProject = projects.find((p) => p.id === projectId);
  const currentPriority = priorityOptions.find((p) => p.value === priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Create New Task</h2>
              <p className="text-xs text-muted-foreground">Add a task to your project</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto">
            {/* Main Content */}
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <Input
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <Textarea
                  placeholder="Add a description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Quick Actions Row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Project Selector */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5">
                      <FolderKanban className="h-3.5 w-3.5" />
                      {selectedProject ? selectedProject.name : 'Select Project'}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-1" align="start">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setProjectId(project.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent',
                          projectId === project.id && 'bg-accent'
                        )}
                      >
                        <div
                          className="h-3 w-3 rounded"
                          style={{ backgroundColor: project.color }}
                        />
                        {project.name}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Status */}
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-auto h-8 gap-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Priority */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5">
                      <Flag className="h-3.5 w-3.5" />
                      <Badge
                        variant="secondary"
                        className={cn('text-xs px-1.5 py-0', currentPriority?.color)}
                      >
                        {currentPriority?.label}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-36 p-1" align="start">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPriority(option.value)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent',
                          priority === option.value && 'bg-accent'
                        )}
                      >
                        <Badge
                          variant="secondary"
                          className={cn('text-xs px-1.5 py-0', option.color)}
                        >
                          {option.label}
                        </Badge>
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Due Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {dueDate ? format(dueDate, 'MMM d, yyyy') : 'Due Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Separator />

              {/* Assignees */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  Assignees
                </Label>
                <div className="flex flex-wrap items-center gap-2">
                  {users.map((user) => {
                    const isSelected = selectedAssignees.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleAssignee(user.id)}
                        className={cn(
                          'flex items-center gap-2 rounded-full border px-2 py-1 text-sm transition-colors',
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:bg-accent'
                        )}
                      >
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{user.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  Tags
                </Label>
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
                          isSelected
                            ? 'border-transparent'
                            : 'border-border hover:bg-accent'
                        )}
                        style={
                          isSelected
                            ? { backgroundColor: tag.color, color: 'white' }
                            : { borderColor: tag.color, color: tag.color }
                        }
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Toggle */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full justify-start text-muted-foreground"
              >
                <ChevronDown
                  className={cn(
                    'h-4 w-4 mr-2 transition-transform',
                    showAdvanced && 'rotate-180'
                  )}
                />
                {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
              </Button>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="space-y-4 animate-fade-in">
                  {/* Time Estimate */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Time Estimate (hours)
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 4"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                      className="w-32"
                      min="0"
                      step="0.5"
                    />
                  </div>

                  {/* Subtasks */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ListTodo className="h-3.5 w-3.5" />
                      Subtasks
                    </Label>
                    <div className="space-y-2">
                      {subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-2 rounded-md border border-border px-3 py-2"
                        >
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={(checked) => {
                              setSubtasks((prev) =>
                                prev.map((s) =>
                                  s.id === subtask.id
                                    ? { ...s, completed: !!checked }
                                    : s
                                )
                              );
                            }}
                          />
                          <span
                            className={cn(
                              'flex-1 text-sm',
                              subtask.completed && 'line-through text-muted-foreground'
                            )}
                          >
                            {subtask.title}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeSubtask(subtask.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Add a subtask..."
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSubtask();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSubtask}
                          disabled={!newSubtask.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/30">
            <div className="text-xs text-muted-foreground">
              Press <kbd className="rounded border border-border px-1.5 py-0.5 font-mono">⌘</kbd> + <kbd className="rounded border border-border px-1.5 py-0.5 font-mono">Enter</kbd> to create
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Create Task
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
