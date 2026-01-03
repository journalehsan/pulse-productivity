import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export type PresenceStatus = 'online' | 'busy' | 'away' | 'offline';

interface PresenceAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  status?: PresenceStatus;
  className?: string;
  showStatus?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const statusIndicatorSizes = {
  sm: 'h-2 w-2 border',
  md: 'h-2.5 w-2.5 border-2',
  lg: 'h-3 w-3 border-2',
};

const statusColors: Record<PresenceStatus, string> = {
  online: 'bg-green-500',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
  offline: 'bg-muted-foreground',
};

export const PresenceAvatar: React.FC<PresenceAvatarProps> = ({
  src,
  name,
  size = 'md',
  status = 'offline',
  className,
  showStatus = true,
}) => {
  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar className={cn(sizeClasses[size], 'border-2 border-background')}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="text-xs font-medium">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-background',
            statusIndicatorSizes[size],
            statusColors[status]
          )}
          title={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      )}
    </div>
  );
};

// Helper to get a random status for demo purposes
export const getRandomStatus = (userId: string): PresenceStatus => {
  const statuses: PresenceStatus[] = ['online', 'busy', 'away', 'offline'];
  // Use a deterministic "random" based on user ID for consistency
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return statuses[hash % statuses.length];
};
