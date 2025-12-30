import React from 'react';
import { DemoUser, getRedirectPath } from '@/types/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DemoUserCardProps {
  user: DemoUser;
  isSelected: boolean;
  onSelect: (user: DemoUser) => void;
}

const roleBadgeStyles: Record<string, string> = {
  ADMIN: 'bg-destructive/10 text-destructive border-destructive/20',
  MANAGER: 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  STAFF: 'bg-primary/10 text-primary border-primary/20',
};

export const DemoUserCard: React.FC<DemoUserCardProps> = ({
  user,
  isSelected,
  onSelect,
}) => {
  const redirectPath = getRedirectPath(user.role);

  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className={cn(
        'w-full text-left p-4 rounded-lg border transition-all duration-200',
        'hover:shadow-md hover:border-primary/50',
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card'
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-muted text-muted-foreground font-medium">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground">{user.name}</span>
            <Badge
              variant="outline"
              className={cn('text-[10px] px-1.5 py-0', roleBadgeStyles[user.role])}
            >
              {user.role}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {user.email}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {user.description}
          </p>
          {isSelected && (
            <p className="text-xs text-primary mt-2 font-medium animate-fade-in">
              → Redirects to {redirectPath}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};
