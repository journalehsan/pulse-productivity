import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, Users, Tag, Clock, MessageSquare, Activity, Play, Pause, Paperclip, Plus, Check, Pencil, Trash2 } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Task, User, Tag as TagType } from '@/types';
import { comments, users, activityEvents, tags as allTags, usersByUsername, getUsernameForUser } from '@/data/mockData';
import { format } from 'date-fns';
import { TaskAttachments } from '@/components/files/TaskAttachments';
import { Link } from 'react-router-dom';

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
  const [assignees, setAssignees] = useState<User[]>(task?.assignees || []);
  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);
  const [taskTags, setTaskTags] = useState<TagType[]>(task?.tags || []);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [mentionCursorPosition, setMentionCursorPosition] = useState(0);
  const [localComments, setLocalComments] = useState<Array<{
    id: string;
    content: string;
    userId: string;
    createdAt: string;
  }>>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [mentionSelectedIndex, setMentionSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter users for mention suggestions
  const filteredMentionUsers = users.filter((user) =>
    getUsernameForUser(user).includes(mentionFilter.toLowerCase())
  );

  // Reset selected index when filtered users change
  useEffect(() => {
    setMentionSelectedIndex(0);
  }, [filteredMentionUsers.length, mentionFilter]);

  // Early return after all hooks
  if (!task) return null;

  const taskComments = comments.filter((c) => c.taskId === task.id);
  const taskActivity = activityEvents.filter((e) => e.taskId === task.id);
  
  // Get available users (not already assigned)
  const availableUsers = users.filter(
    (user) => !assignees.some((a) => a.id === user.id)
  );

  const handleAddAssignee = (user: User) => {
    setAssignees([...assignees, user]);
  };

  const handleRemoveAssignee = (userId: string) => {
    setAssignees(assignees.filter((a) => a.id !== userId));
  };

  // Get available tags (not already added)
  const availableTags = allTags.filter(
    (tag) => !taskTags.some((t) => t.id === tag.id)
  );

  const handleAddTag = (tag: TagType) => {
    setTaskTags([...taskTags, tag]);
  };

  const handleRemoveTag = (tagId: string) => {
    setTaskTags(taskTags.filter((t) => t.id !== tagId));
  };

  // Parse comment content and render mentions as styled links
  const renderCommentWithMentions = (content: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      const username = match[1].toLowerCase();
      const mentionedUser = usersByUsername[username];

      if (mentionedUser) {
        parts.push(
          <Link
            key={`${match.index}-${username}`}
            to={`/app/profile/${mentionedUser.id}`}
            className="inline-flex items-center gap-0.5 text-primary font-medium hover:underline bg-primary/10 px-1 rounded"
          >
            @{mentionedUser.name.split(' ')[0].toLowerCase()}{mentionedUser.name.split(' ')[1]?.toLowerCase() || ''}
          </Link>
        );
      } else {
        parts.push(
          <span key={`${match.index}-${username}`} className="text-primary font-medium bg-primary/10 px-1 rounded">
            @{match[1]}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setCommentText(value);
    setMentionCursorPosition(cursorPos);

    // Check if we're typing a mention
    const textBeforeCursor = value.slice(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionFilter(mentionMatch[1]);
      setShowMentionSuggestions(true);
    } else {
      setShowMentionSuggestions(false);
      setMentionFilter('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentionSuggestions || filteredMentionUsers.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setMentionSelectedIndex((prev) => 
        prev < filteredMentionUsers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setMentionSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && showMentionSuggestions) {
      e.preventDefault();
      insertMention(filteredMentionUsers[mentionSelectedIndex]);
    } else if (e.key === 'Escape') {
      setShowMentionSuggestions(false);
    }
  };

  const insertMention = (user: User) => {
    const textBeforeCursor = commentText.slice(0, mentionCursorPosition);
    const textAfterCursor = commentText.slice(mentionCursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const newTextBefore = textBeforeCursor.slice(0, mentionMatch.index) + '@' + getUsernameForUser(user) + ' ';
      setCommentText(newTextBefore + textAfterCursor);
    }

    setShowMentionSuggestions(false);
    setMentionFilter('');
    setMentionSelectedIndex(0);
    textareaRef.current?.focus();
  };

  // Edit/Delete local comments
  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(content);
  };

  const handleSaveEditComment = (commentId: string) => {
    if (!editingCommentText.trim()) return;
    setLocalComments(localComments.map((c) =>
      c.id === commentId ? { ...c, content: editingCommentText } : c
    ));
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    setLocalComments(localComments.filter((c) => c.id !== commentId));
  };

  // Handle posting a new comment (UI only - temporary)
  const handlePostComment = () => {
    if (!commentText.trim()) return;
    
    // Use a demo user (first user in the list) for the comment
    const currentUserId = users[0]?.id || 'user-1';
    
    const newComment = {
      id: `local-${Date.now()}`,
      content: commentText,
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    };
    
    setLocalComments([...localComments, newComment]);
    setCommentText('');
    setShowMentionSuggestions(false);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed right-0 top-14 bottom-0 w-full max-w-md border-l border-border bg-card shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Task Details</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Title */}
        <div>
          <Input
            defaultValue={task.title}
            className="text-lg font-semibold border-0 px-0 h-auto py-1 focus-visible:ring-0 bg-transparent"
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
            {assignees.map((user) => (
              <div
                key={user.id}
                className="group flex items-center gap-2 rounded-full bg-muted px-2 py-1 pr-1"
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
                <button
                  onClick={() => handleRemoveAssignee(user.id)}
                  className="ml-1 rounded-full p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label={`Remove ${user.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <Popover open={isAssigneePopoverOpen} onOpenChange={setIsAssigneePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Add team members
                  </p>
                  {availableUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-3">
                      All team members are assigned
                    </p>
                  ) : (
                    availableUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          handleAddAssignee(user);
                          setIsAssigneePopoverOpen(false);
                        }}
                        className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.role}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
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
            {taskTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                style={{ borderColor: tag.color, color: tag.color }}
                className="pr-1 gap-1"
              >
                {tag.name}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label={`Remove ${tag.name} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add tag
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Available tags
                  </p>
                  {availableTags.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-3">
                      All tags are added
                    </p>
                  ) : (
                    availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          handleAddTag(tag);
                          setIsTagPopoverOpen(false);
                        }}
                        className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
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

        {/* Attachments Section */}
        <TaskAttachments taskId={task.id} projectId={task.projectId} />

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
            {taskComments.length === 0 && localComments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet
              </p>
            ) : (
              <>
                {taskComments.map((comment) => {
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
                        <p className="text-sm mt-1">{renderCommentWithMentions(comment.content)}</p>
                      </div>
                    </div>
                  );
                })}
                {localComments.map((comment) => {
                  const user = users.find((u) => u.id === comment.userId);
                  const isEditing = editingCommentId === comment.id;
                  return (
                    <div key={comment.id} className="flex gap-3 group">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{user?.name}</span>
                          <Badge variant="outline" className="text-[10px] px-1 py-0">New</Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                          </span>
                          {!isEditing && (
                            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleEditComment(comment.id, comment.content)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="mt-1 space-y-2">
                            <Textarea
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              rows={2}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveEditComment(comment.id)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEditComment}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm mt-1">{renderCommentWithMentions(comment.content)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            <div className="pt-2 relative">
              <Textarea 
                ref={textareaRef}
                placeholder="Write a comment... Use @ to mention someone" 
                rows={2}
                value={commentText}
                onChange={handleCommentChange}
                onKeyDown={handleKeyDown}
              />
              {showMentionSuggestions && filteredMentionUsers.length > 0 && (
                <div className="absolute bottom-full left-0 mb-1 w-64 bg-popover border border-border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  <p className="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border">
                    Mention someone (↑↓ to navigate, Enter to select)
                  </p>
                  {filteredMentionUsers.map((user, index) => (
                    <button
                      key={user.id}
                      onClick={() => insertMention(user)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                        index === mentionSelectedIndex ? 'bg-muted' : 'hover:bg-muted'
                      }`}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">@{getUsernameForUser(user)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Tip: Type @ to mention teammates
                </p>
                <Button 
                  size="sm" 
                  onClick={handlePostComment}
                  disabled={!commentText.trim()}
                >
                  Post Comment
                </Button>
              </div>
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
