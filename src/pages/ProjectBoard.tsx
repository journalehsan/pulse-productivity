import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, List, LayoutGrid, Calendar, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TaskTree } from '@/components/tasks/TaskTree';
import { TaskDetailsDrawer } from '@/components/tasks/TaskDetailsDrawer';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { FilterBar } from '@/components/tasks/FilterBar';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { ImportTasksModal } from '@/components/modals/ImportTasksModal';
import { NoTasksEmptyState } from '@/components/common/EmptyState';
import { ProjectCalendar } from '@/components/calendar/ProjectCalendar';
import { ProjectFilesTab } from '@/components/files/ProjectFilesTab';
import { PresenceAvatar, getRandomStatus } from '@/components/common/PresenceAvatar';
import { SummarizeProjectButton, AutoAssignButton } from '@/components/common/AIFeaturePlaceholders';
import { projects, getNestedTasks, tasks as allTasks } from '@/data/mockData';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

const ProjectBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [importedTasks, setImportedTasks] = useState<Task[]>([]);

  const project = projects.find((p) => p.id === projectId);
  
  // Combine mock tasks with imported tasks
  const nestedTasks = useMemo(() => {
    if (!projectId) return [];
    const baseTasks = getNestedTasks(projectId);
    // Add imported tasks to the root level (they may have parentId set)
    const importedForProject = importedTasks.filter((t) => t.projectId === projectId);
    return [...baseTasks, ...importedForProject.filter((t) => !t.parentId)];
  }, [projectId, importedTasks]);

  // Flat list of project tasks for calendar (including imported)
  const projectTasks = useMemo(() => {
    const baseTasks = allTasks.filter((t) => t.projectId === projectId);
    const importedForProject = importedTasks.filter((t) => t.projectId === projectId);
    return [...baseTasks, ...importedForProject];
  }, [projectId, importedTasks]);

  // Handle import
  const handleImport = useCallback((tasks: Task[]) => {
    setImportedTasks((prev) => [...prev, ...tasks]);
  }, []);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const allProjectTasks = [...project.tasks, ...importedTasks.filter((t) => t.projectId === projectId)];
  const taskCounts = {
    total: allProjectTasks.length,
    done: allProjectTasks.filter((t) => t.status === 'done').length,
    inProgress: allProjectTasks.filter((t) => t.status === 'in_progress').length,
  };

  const progressPercent = taskCounts.total > 0 
    ? Math.round((taskCounts.done / taskCounts.total) * 100) 
    : 0;

  const handleQuickAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskTitle.trim()) {
      console.log('Quick add task:', newTaskTitle);
      setNewTaskTitle('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={project.name}
        description={project.description}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Projects', href: '/app/projects' },
              { label: project.name },
            ]}
          />
        }
        actions={
          <div className="flex items-center gap-2">
            {/* Team Members with Presence */}
            <div className="flex -space-x-2 mr-2">
              {project.members.slice(0, 4).map((member) => (
                <Tooltip key={member.id}>
                  <TooltipTrigger asChild>
                    <div>
                      <PresenceAvatar
                        src={member.avatar}
                        name={member.name}
                        size="md"
                        status={getRandomStatus(member.id)}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">{member.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {project.members.length > 4 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                  +{project.members.length - 4}
                </div>
              )}
            </div>

            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50">
              <div className="w-16">
                <Progress value={progressPercent} className="h-1.5" />
              </div>
              <span className="text-xs font-medium">
                {taskCounts.done}/{taskCounts.total}
              </span>
            </div>

            {/* AI Buttons */}
            <SummarizeProjectButton />
            <AutoAssignButton />

            <Button variant="outline" size="sm" onClick={() => setImportModalOpen(true)}>
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>

            <Button size="sm" onClick={() => setCreateTaskOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b border-border px-6">
          <TabsList className="h-11 bg-transparent p-0 gap-6">
            <TabsTrigger
              value="list"
              className={cn(
                'h-11 rounded-none border-b-2 border-transparent px-0 pb-3 pt-3 font-medium',
                'data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary',
                'text-muted-foreground hover:text-foreground transition-colors'
              )}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className={cn(
                'h-11 rounded-none border-b-2 border-transparent px-0 pb-3 pt-3 font-medium',
                'data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary',
                'text-muted-foreground hover:text-foreground transition-colors'
              )}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className={cn(
                'h-11 rounded-none border-b-2 border-transparent px-0 pb-3 pt-3 font-medium',
                'data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary',
                'text-muted-foreground hover:text-foreground transition-colors'
              )}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className={cn(
                'h-11 rounded-none border-b-2 border-transparent px-0 pb-3 pt-3 font-medium',
                'data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary',
                'text-muted-foreground hover:text-foreground transition-colors'
              )}
            >
              <FileText className="h-4 w-4 mr-2" />
              Files
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Quick Add Task */}
        <div className="px-4 py-2 border-b border-border bg-muted/20">
          <Input
            placeholder="Press Enter to add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleQuickAdd}
            className="bg-background border-dashed h-9 text-sm"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="list" className="h-full m-0 overflow-y-auto">
            {nestedTasks.length === 0 ? (
              <NoTasksEmptyState onCreate={() => setCreateTaskOpen(true)} />
            ) : (
              <TaskTree
                tasks={nestedTasks}
                onSelectTask={setSelectedTask}
                selectedTaskId={selectedTask?.id}
              />
            )}
          </TabsContent>

          <TabsContent value="board" className="h-full m-0 overflow-hidden">
            {nestedTasks.length === 0 ? (
              <NoTasksEmptyState onCreate={() => setCreateTaskOpen(true)} />
            ) : (
              <KanbanBoard
                tasks={nestedTasks}
                onSelectTask={setSelectedTask}
                selectedTaskId={selectedTask?.id}
                onTaskMove={(taskId, newStatus) => {
                  console.log(`Task ${taskId} moved to ${newStatus}`);
                  // In a real app, this would update the backend
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="h-full m-0">
            <ProjectCalendar
              tasks={projectTasks}
              onTaskClick={setSelectedTask}
              onCreateTask={() => setCreateTaskOpen(true)}
            />
          </TabsContent>

          <TabsContent value="files" className="h-full m-0 p-4 overflow-y-auto">
            {projectId && <ProjectFilesTab projectId={projectId} />}
          </TabsContent>
        </div>
      </Tabs>

      {/* Task Details Drawer */}
      <TaskDetailsDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        defaultProjectId={projectId}
      />

      {/* Import Tasks Modal */}
      <ImportTasksModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        projectId={projectId || ''}
        onImport={handleImport}
      />
    </div>
  );
};

export default ProjectBoard;
