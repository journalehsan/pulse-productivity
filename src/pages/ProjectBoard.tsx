import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, List, LayoutGrid, Calendar, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { projects, getNestedTasks, tasks as allTasks } from '@/data/mockData';
import { Task } from '@/types';

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
            <div className="flex -space-x-2 mr-2">
              {project.members.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {project.members.length > 4 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                  +{project.members.length - 4}
                </div>
              )}
            </div>

            <Badge variant="outline" className="hidden sm:flex gap-1">
              <span className="text-muted-foreground">{taskCounts.done}</span>
              <span>/</span>
              <span>{taskCounts.total}</span>
              <span className="text-muted-foreground">done</span>
            </Badge>

            <Button variant="outline" onClick={() => setImportModalOpen(true)}>
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>

            <Button onClick={() => setCreateTaskOpen(true)}>
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
          <TabsList className="h-12 bg-transparent p-0 gap-4">
            <TabsTrigger
              value="list"
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Files
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Quick Add Task */}
        <div className="px-4 py-2 border-b border-border">
          <Input
            placeholder="Press Enter to add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleQuickAdd}
            className="bg-muted/50 border-dashed"
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
