import React from 'react';
import { LucideIcon, FolderOpen, Search, CheckCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
};

// Preset empty states
export const NoTasksEmptyState: React.FC<{ onCreate?: () => void }> = ({
  onCreate,
}) => (
  <EmptyState
    icon={CheckCircle}
    title="No tasks yet"
    description="Get started by creating your first task. Break down your work into manageable pieces."
    action={onCreate ? { label: 'Create Task', onClick: onCreate } : undefined}
  />
);

export const NoProjectsEmptyState: React.FC<{ onCreate?: () => void }> = ({
  onCreate,
}) => (
  <EmptyState
    icon={FolderOpen}
    title="No projects yet"
    description="Projects help you organize related tasks. Create one to get started."
    action={onCreate ? { label: 'Create Project', onClick: onCreate } : undefined}
  />
);

export const NoSearchResultsEmptyState: React.FC = () => (
  <EmptyState
    icon={Search}
    title="No results found"
    description="Try adjusting your search or filters to find what you're looking for."
  />
);

export const NoReportsEmptyState: React.FC = () => (
  <EmptyState
    icon={FileText}
    title="No reports available"
    description="Complete some tasks to generate reports and track your progress."
  />
);
