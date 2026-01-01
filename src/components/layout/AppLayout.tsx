import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { TaskDetailsDrawer } from '@/components/tasks/TaskDetailsDrawer';
import { Task, Project } from '@/types';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleProjectSelect = (project: Project) => {
    navigate(`/app/projects/${project.id}`);
  };

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
        <TopBar 
          onCreateTask={() => setCreateTaskOpen(true)} 
          onTaskSelect={handleTaskSelect}
          onProjectSelect={handleProjectSelect}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Global Create Task Modal */}
      <CreateTaskModal
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
      />

      {/* Global Task Details Drawer from Search */}
      <TaskDetailsDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};
