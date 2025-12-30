import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onCreateTask={() => setCreateTaskOpen(true)}
      />
      <div
        className={cn(
          'flex flex-col transition-all duration-200',
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        )}
      >
        <TopBar onCreateTask={() => setCreateTaskOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Global Create Task Modal */}
      <CreateTaskModal
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
      />
    </div>
  );
};
