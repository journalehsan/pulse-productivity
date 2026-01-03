import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Clock,
  Plus,
  ChevronDown,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Calendar,
  FileText,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { workspaces, currentUser } from '@/data/mockData';
import { clearSession } from '@/types/auth';
import { PresenceAvatar, getRandomStatus } from '@/components/common/PresenceAvatar';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onCreateTask: () => void;
}

interface NavItemConfig {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const mainNavItems: NavItemConfig[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: FolderKanban, label: 'Projects', path: '/app/projects', badge: 2 },
  { icon: Calendar, label: 'Calendar', path: '/app/calendar' },
];

const workNavItems: NavItemConfig[] = [
  { icon: Clock, label: 'Timesheets', path: '/app/timesheets' },
  { icon: BarChart3, label: 'Reports', path: '/app/reports' },
  { icon: FileText, label: 'Docs', path: '/app/docs' },
];

const NavItem: React.FC<{
  item: NavItemConfig;
  collapsed: boolean;
  isActive: boolean;
}> = ({ item, collapsed, isActive }) => (
  <Link
    to={item.path}
    className={cn(
      'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      collapsed && 'justify-center px-2'
    )}
    title={collapsed ? item.label : undefined}
  >
    <item.icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
    {!collapsed && (
      <>
        <span className="flex-1">{item.label}</span>
        {item.badge && item.badge > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground text-center leading-none">
            {item.badge}
          </span>
        )}
      </>
    )}
    {collapsed && item.badge && item.badge > 0 && (
      <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-primary" />
    )}
  </Link>
);

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onToggle, onCreateTask }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedWorkspace, setSelectedWorkspace] = React.useState(workspaces[0]);

  const handleLogout = () => {
    clearSession();
    navigate('/auth/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-full flex-col border-r border-border bg-card transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Workspace Switcher */}
      <div className="flex h-14 items-center border-b border-border px-3">
        {!collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-9 w-full items-center justify-between px-2 text-left hover:bg-muted"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                    {selectedWorkspace.name.charAt(0)}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-semibold">
                      {selectedWorkspace.name}
                    </span>
                    <span className="truncate text-[10px] text-muted-foreground">
                      {selectedWorkspace.members.length} members
                    </span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Workspaces
              </div>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => setSelectedWorkspace(ws)}
                  className={cn(
                    'flex items-center gap-2',
                    ws.id === selectedWorkspace.id && 'bg-accent'
                  )}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-semibold text-primary-foreground">
                    {ws.name.charAt(0)}
                  </div>
                  <span className="flex-1">{ws.name}</span>
                  {ws.id === selectedWorkspace.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex w-full items-center justify-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              {selectedWorkspace.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      {/* Create Task Button */}
      <div className="p-3">
        <Button
          onClick={onCreateTask}
          className={cn(
            'w-full gap-2 shadow-sm',
            collapsed && 'px-0'
          )}
          size={collapsed ? 'icon' : 'default'}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span>Create Task</span>}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {/* Main Section */}
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Main
          </div>
        )}
        <div className="space-y-0.5">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.path)}
            />
          ))}
        </div>

        <Separator className="my-3" />

        {/* Work Section */}
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Work
          </div>
        )}
        <div className="space-y-0.5">
          {workNavItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.path)}
            />
          ))}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            'w-full text-muted-foreground hover:text-foreground',
            collapsed ? 'justify-center' : 'justify-start'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* User Section */}
      <div className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted',
                collapsed && 'justify-center px-0'
              )}
            >
              <PresenceAvatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="md"
                status={getRandomStatus(currentUser.id)}
              />
              {!collapsed && (
                <div className="flex-1 overflow-hidden text-left">
                  <p className="truncate text-sm font-medium">{currentUser.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {currentUser.role}
                  </p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
