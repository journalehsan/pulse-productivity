import { User, Workspace, Project, Task, Tag, TimeEntry, ActivityEvent, Comment } from '@/types';

export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@company.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  role: 'Admin',
};

export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    role: 'Manager',
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'Member',
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    role: 'Member',
  },
  {
    id: 'user-5',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    role: 'Viewer',
  },
];

// Username map for mentions (lowercase username -> user)
export const usersByUsername: Record<string, User> = {
  'alexmorgan': users[0],
  'sarahchen': users[1],
  'mikejohnson': users[2],
  'emilydavis': users[3],
  'jameswilson': users[4],
};

export const getUsernameForUser = (user: User): string => {
  return user.name.toLowerCase().replace(/\s+/g, '');
};

export const workspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Acme Corporation',
    members: users,
  },
  {
    id: 'ws-2',
    name: 'Personal Projects',
    members: [currentUser],
  },
];

export const tags: Tag[] = [
  { id: 'tag-1', name: 'Frontend', color: 'hsl(210, 100%, 50%)' },
  { id: 'tag-2', name: 'Backend', color: 'hsl(150, 60%, 45%)' },
  { id: 'tag-3', name: 'Design', color: 'hsl(280, 70%, 55%)' },
  { id: 'tag-4', name: 'Bug', color: 'hsl(0, 70%, 55%)' },
  { id: 'tag-5', name: 'Feature', color: 'hsl(45, 90%, 50%)' },
  { id: 'tag-6', name: 'Documentation', color: 'hsl(195, 70%, 50%)' },
];

const createTask = (
  id: string,
  title: string,
  projectId: string,
  status: Task['status'],
  priority: Task['priority'],
  assignees: User[],
  tagIds: string[],
  parentId?: string,
  dueDate?: string,
  description?: string,
  startDate?: string
): Task => ({
  id,
  title,
  description: description || `Description for ${title}`,
  status,
  priority,
  assignees,
  startDate,
  dueDate,
  tags: tags.filter(t => tagIds.includes(t.id)),
  parentId,
  projectId,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
  estimatedHours: Math.floor(Math.random() * 16) + 2,
  loggedHours: Math.floor(Math.random() * 8),
  isExpanded: true,
});

// Helper to generate dates relative to current month for demo
const getRelativeDate = (dayOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().split('T')[0];
};

export const tasks: Task[] = [
  // Project 1 - Website Redesign
  createTask('task-1', 'Homepage redesign', 'proj-1', 'in_progress', 'high', [users[0], users[1]], ['tag-1', 'tag-3'], undefined, getRelativeDate(5), 'Complete overhaul of the homepage with new branding', getRelativeDate(0)),
  createTask('task-2', 'Update hero section', 'proj-1', 'in_progress', 'high', [users[1]], ['tag-1'], 'task-1', getRelativeDate(2)),
  createTask('task-3', 'Design new navigation', 'proj-1', 'done', 'medium', [users[2]], ['tag-3'], 'task-1', getRelativeDate(-2)),
  createTask('task-4', 'Implement responsive menu', 'proj-1', 'review', 'medium', [users[0]], ['tag-1'], 'task-3', getRelativeDate(4)),
  createTask('task-5', 'Footer component', 'proj-1', 'backlog', 'low', [users[3]], ['tag-1'], 'task-1', getRelativeDate(12)),
  createTask('task-6', 'API integration', 'proj-1', 'in_progress', 'urgent', [users[0], users[2]], ['tag-2'], undefined, getRelativeDate(1), 'Connect frontend to new REST API'),
  createTask('task-7', 'Setup authentication endpoints', 'proj-1', 'done', 'high', [users[2]], ['tag-2'], 'task-6', getRelativeDate(-1)),
  createTask('task-8', 'Implement data fetching hooks', 'proj-1', 'in_progress', 'high', [users[0]], ['tag-1', 'tag-2'], 'task-6', getRelativeDate(3)),
  createTask('task-9', 'Error handling middleware', 'proj-1', 'backlog', 'medium', [users[2]], ['tag-2'], 'task-6', getRelativeDate(8)),
  createTask('task-10', 'Write unit tests', 'proj-1', 'backlog', 'medium', [users[3]], ['tag-6'], undefined, getRelativeDate(15)),
  
  // Additional calendar-friendly tasks for proj-1
  createTask('task-21', 'Sprint planning meeting', 'proj-1', 'in_progress', 'high', [users[0], users[1], users[2]], ['tag-5'], undefined, getRelativeDate(7), 'Weekly sprint planning session', getRelativeDate(7)),
  createTask('task-22', 'Code review session', 'proj-1', 'backlog', 'medium', [users[0], users[2]], ['tag-1', 'tag-2'], undefined, getRelativeDate(10), 'Review all pending PRs'),
  createTask('task-23', 'Design system documentation', 'proj-1', 'in_progress', 'medium', [users[1]], ['tag-3', 'tag-6'], undefined, getRelativeDate(14), 'Document all design tokens and components', getRelativeDate(11)),
  createTask('task-24', 'Performance audit', 'proj-1', 'backlog', 'high', [users[0]], ['tag-1'], undefined, getRelativeDate(6), 'Run Lighthouse audit and fix issues'),
  createTask('task-25', 'User testing session', 'proj-1', 'review', 'urgent', [users[1], users[3]], ['tag-3'], undefined, getRelativeDate(0), 'Conduct user testing with 5 participants'),
  createTask('task-26', 'Analytics integration', 'proj-1', 'backlog', 'low', [users[2]], ['tag-2'], undefined, getRelativeDate(18)),
  createTask('task-27', 'SEO optimization', 'proj-1', 'in_progress', 'medium', [users[0]], ['tag-1'], undefined, getRelativeDate(9), 'Implement meta tags and structured data', getRelativeDate(8)),
  createTask('task-28', 'Accessibility review', 'proj-1', 'backlog', 'high', [users[3]], ['tag-1', 'tag-6'], undefined, getRelativeDate(13)),
  
  // Project 2 - Mobile App
  createTask('task-11', 'User authentication flow', 'proj-2', 'in_progress', 'urgent', [users[1], users[3]], ['tag-1', 'tag-2'], undefined, getRelativeDate(2), 'Implement complete auth flow with social login'),
  createTask('task-12', 'Login screen UI', 'proj-2', 'done', 'high', [users[3]], ['tag-3'], 'task-11', getRelativeDate(-3)),
  createTask('task-13', 'OAuth integration', 'proj-2', 'in_progress', 'high', [users[1]], ['tag-2'], 'task-11', getRelativeDate(1)),
  createTask('task-14', 'Password reset flow', 'proj-2', 'backlog', 'medium', [users[3]], ['tag-1'], 'task-11', getRelativeDate(11)),
  createTask('task-15', 'Dashboard widgets', 'proj-2', 'review', 'high', [users[0]], ['tag-1', 'tag-3'], undefined, getRelativeDate(4)),
  createTask('task-16', 'Activity chart component', 'proj-2', 'done', 'medium', [users[0]], ['tag-1'], 'task-15', getRelativeDate(-1)),
  createTask('task-17', 'Quick stats cards', 'proj-2', 'review', 'medium', [users[1]], ['tag-1', 'tag-3'], 'task-15', getRelativeDate(5)),
  createTask('task-18', 'Push notifications', 'proj-2', 'backlog', 'high', [users[2]], ['tag-2', 'tag-5'], undefined, getRelativeDate(20)),
  createTask('task-19', 'Fix login bug on Android', 'proj-2', 'in_progress', 'urgent', [users[3]], ['tag-4'], undefined, getRelativeDate(0)),
  createTask('task-20', 'Performance optimization', 'proj-2', 'backlog', 'medium', [users[0], users[2]], ['tag-1', 'tag-2'], undefined, getRelativeDate(25)),
];

// Build nested task structure
export const getNestedTasks = (projectId: string): Task[] => {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const rootTasks = projectTasks.filter(t => !t.parentId);
  
  const buildSubtasks = (parentTask: Task): Task => {
    const children = projectTasks.filter(t => t.parentId === parentTask.id);
    return {
      ...parentTask,
      subtasks: children.map(buildSubtasks),
    };
  };
  
  return rootTasks.map(buildSubtasks);
};

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved UX',
    members: [users[0], users[1], users[2], users[3]],
    tasks: tasks.filter(t => t.projectId === 'proj-1'),
    progress: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    workspaceId: 'ws-1',
    color: 'hsl(210, 100%, 50%)',
  },
  {
    id: 'proj-2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms',
    members: [users[0], users[1], users[3]],
    tasks: tasks.filter(t => t.projectId === 'proj-2'),
    progress: 62,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-24T18:00:00Z',
    workspaceId: 'ws-1',
    color: 'hsl(150, 60%, 45%)',
  },
];

export const timeEntries: TimeEntry[] = [
  { id: 'time-1', taskId: 'task-1', userId: 'user-1', date: '2024-01-25', hours: 3.5, description: 'Homepage layout work', createdAt: '2024-01-25T17:00:00Z' },
  { id: 'time-2', taskId: 'task-2', userId: 'user-2', date: '2024-01-25', hours: 2, description: 'Hero section styling', createdAt: '2024-01-25T15:00:00Z' },
  { id: 'time-3', taskId: 'task-6', userId: 'user-1', date: '2024-01-24', hours: 4, description: 'API endpoint setup', createdAt: '2024-01-24T18:00:00Z' },
  { id: 'time-4', taskId: 'task-11', userId: 'user-2', date: '2024-01-24', hours: 5, description: 'Auth flow implementation', createdAt: '2024-01-24T17:30:00Z' },
  { id: 'time-5', taskId: 'task-15', userId: 'user-1', date: '2024-01-23', hours: 3, description: 'Dashboard widgets', createdAt: '2024-01-23T16:00:00Z' },
];

export const activityEvents: ActivityEvent[] = [
  { id: 'evt-1', type: 'task_completed', userId: 'user-1', taskId: 'task-3', projectId: 'proj-1', description: 'completed "Design new navigation"', createdAt: '2024-01-25T14:30:00Z' },
  { id: 'evt-2', type: 'task_assigned', userId: 'user-2', taskId: 'task-8', projectId: 'proj-1', description: 'was assigned to "Implement data fetching hooks"', createdAt: '2024-01-25T12:00:00Z' },
  { id: 'evt-3', type: 'comment_added', userId: 'user-3', taskId: 'task-6', projectId: 'proj-1', description: 'commented on "API integration"', createdAt: '2024-01-25T11:30:00Z' },
  { id: 'evt-4', type: 'time_logged', userId: 'user-1', taskId: 'task-1', projectId: 'proj-1', description: 'logged 3.5 hours on "Homepage redesign"', createdAt: '2024-01-25T10:00:00Z' },
  { id: 'evt-5', type: 'status_changed', userId: 'user-4', taskId: 'task-12', projectId: 'proj-2', description: 'changed status of "Login screen UI" to Done', createdAt: '2024-01-24T16:00:00Z' },
  { id: 'evt-6', type: 'task_created', userId: 'user-2', taskId: 'task-19', projectId: 'proj-2', description: 'created "Fix login bug on Android"', createdAt: '2024-01-24T09:00:00Z' },
];

export const comments: Comment[] = [
  { id: 'cmt-1', taskId: 'task-1', userId: 'user-2', content: 'Looking great so far! @alexmorgan can we add more contrast to the CTA buttons?', createdAt: '2024-01-25T11:00:00Z' },
  { id: 'cmt-2', taskId: 'task-1', userId: 'user-1', content: 'Good point @sarahchen, I will update the color palette today. @mikejohnson can you review once done?', createdAt: '2024-01-25T11:30:00Z' },
  { id: 'cmt-3', taskId: 'task-6', userId: 'user-3', content: 'The authentication endpoint is ready for testing. @emilydavis please verify the OAuth flow.', createdAt: '2024-01-25T10:00:00Z' },
  { id: 'cmt-4', taskId: 'task-1', userId: 'user-4', content: '@alexmorgan @sarahchen the new designs look amazing! Ship it! 🚀', createdAt: '2024-01-25T14:00:00Z' },
];

export const getTaskStats = () => {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  return {
    dueToday: tasks.filter(t => t.dueDate?.startsWith(today)).length,
    overdue: tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completedThisWeek: tasks.filter(t => t.status === 'done' && t.updatedAt > weekAgo).length,
  };
};
