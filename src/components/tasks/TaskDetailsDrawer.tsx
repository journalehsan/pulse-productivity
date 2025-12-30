import React, { useState } from 'react';
import { X, Calendar, Users, Tag, Clock, MessageSquare, Activity, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Task } from '@/types';
import { comments, users, activityEvents } from '@/data/mockData';
import { format } from 'date-fns';

interface TaskDetailsDrawerProps {
  task: Task | null;
  onClose: () => void;
}

export const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  task,
  onClose,
}) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  if (!task) return null;

  const taskComments = comments.filter((c) => c.taskId === task.id);
  const taskActivity = activityEvents.filter((e) => e.taskId === task.id);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed right-0 top-14 bottom-0 w-full max-w-md border-l border-border bg-background shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-semibold">Task Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Title */}
        <div>
          <Input
            defaultValue={task.title}
            className="text-lg font-medium border-0 px-0 focus-visible:ring-0"
          />
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Status
            </label>
            <Select defaultValue={task.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Priority
            </label>
            <Select defaultValue={task.priority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Description
          </label>
          <Textarea
            defaultValue={task.description}
            rows={3}
            placeholder="Add a description..."
          />
        </div>

        {/* Assignees */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Users className="h-3 w-3" /> Assignees
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {task.assignees.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 rounded-full bg-muted px-2 py-1"
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            ))}
            <Button variant="outline" size="sm">
              + Add
            </Button>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Due Date
          </label>
          <Input
            type="date"
            defaultValue={task.dueDate?.split('T')[0]}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Tag className="h-3 w-3" /> Tags
          </label>
          <div className="flex items-center gap-1 flex-wrap">
            {task.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                style={{ borderColor: tag.color, color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-xs">
              + Add tag
            </Button>
          </div>
        </div>

        <Separator />

        {/* Time Tracking */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Time Tracking
          </label>
          <div className="rounded-lg border border-border p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono">{formatTime(timerSeconds)}</span>
              <div className="flex gap-2">
                <Button
                  variant={isTimerRunning ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => {
                    if (isTimerRunning) {
                      setIsTimerRunning(false);
                    } else {
                      setIsTimerRunning(true);
                      const interval = setInterval(() => {
                        setTimerSeconds((s) => s + 1);
                      }, 1000);
                      // Store interval for cleanup
                      (window as any).timerInterval = interval;
                    }
                  }}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" /> Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" /> Start
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Estimated:</div>
              <div>{task.estimatedHours || 0}h</div>
              <div className="text-muted-foreground">Logged:</div>
              <div>{task.loggedHours || 0}h</div>
            </div>
            <Input placeholder="Log time manually (e.g., 2h 30m)" />
          </div>
        </div>

        <Separator />

        {/* Comments & Activity Tabs */}
        <Tabs defaultValue="comments">
          <TabsList className="w-full">
            <TabsTrigger value="comments" className="flex-1 gap-1">
              <MessageSquare className="h-3 w-3" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1 gap-1">
              <Activity className="h-3 w-3" />
              Activity
            </TabsTrigger>
          </TabsList>
          <TabsContent value="comments" className="mt-4 space-y-4">
            {taskComments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet
              </p>
            ) : (
              taskComments.map((comment) => {
                const user = users.find((u) => u.id === comment.userId);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div className="pt-2">
              <Textarea placeholder="Write a comment..." rows={2} />
              <Button size="sm" className="mt-2">
                Post Comment
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="activity" className="mt-4 space-y-3">
            {taskActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No activity yet
              </p>
            ) : (
              taskActivity.map((event) => {
                const user = users.find((u) => u.id === event.userId);
                return (
                  <div key={event.id} className="flex gap-3 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-xs">{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{user?.name}</span>{' '}
                      <span className="text-muted-foreground">{event.description}</span>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(event.createdAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
