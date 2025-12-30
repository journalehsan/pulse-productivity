export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Admin' | 'Manager' | 'Member' | 'Viewer';
}

export interface Workspace {
  id: string;
  name: string;
  logo?: string;
  members: User[];
}

export interface Team {
  id: string;
  name: string;
  members: User[];
  workspaceId: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignees: User[];
  dueDate?: string;
  tags: Tag[];
  parentId?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  loggedHours?: number;
  subtasks?: Task[];
  isExpanded?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  members: User[];
  tasks: Task[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  color: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  date: string;
  hours: number;
  description?: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  type: 'task_created' | 'task_completed' | 'task_assigned' | 'comment_added' | 'time_logged' | 'status_changed';
  userId: string;
  taskId?: string;
  projectId?: string;
  description: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}
