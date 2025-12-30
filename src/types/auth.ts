export type Role = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: Role;
  workspaceId: string;
  teamId: string;
  rememberMe?: boolean;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  description: string;
}

export const getRedirectPath = (role: Role): string => {
  switch (role) {
    case 'ADMIN':
      return '/app/dashboard';
    case 'MANAGER':
      return '/app/projects';
    case 'STAFF':
      return '/app/timesheets';
    default:
      return '/app/dashboard';
  }
};

export const demoUsers: DemoUser[] = [
  {
    id: 'user-admin',
    name: 'Alex Chen',
    email: 'admin@acme.local',
    password: 'Admin123!',
    role: 'ADMIN',
    description: 'Full access to all features and settings',
  },
  {
    id: 'user-manager',
    name: 'Sara Mohammadi',
    email: 'manager@acme.local',
    password: 'Manager123!',
    role: 'MANAGER',
    description: 'Manage projects and team members',
  },
  {
    id: 'user-staff',
    name: 'Reza Karimi',
    email: 'staff@acme.local',
    password: 'Staff123!',
    role: 'STAFF',
    description: 'Track time and complete tasks',
  },
];

export const SESSION_KEY = 'pulse_session';

export const saveSession = (session: UserSession): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): UserSession | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};
