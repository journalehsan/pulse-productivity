import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Grid, List, MoreHorizontal, Settings, Archive, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { NoProjectsEmptyState } from '@/components/common/EmptyState';
import { PresenceAvatar, getRandomStatus } from '@/components/common/PresenceAvatar';
import { SummarizeProjectButton, GenerateReportButton } from '@/components/common/AIFeaturePlaceholders';
import { projects } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOpenTaskCount = (project: typeof projects[0]) => {
    return project.tasks.filter(t => t.status !== 'done').length;
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Projects"
        description="Manage and organize your team's projects."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Projects' }]} />}
        actions={
          <div className="flex items-center gap-2">
            <SummarizeProjectButton />
            <GenerateReportButton />
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Project
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('list')}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <NoProjectsEmptyState onCreate={() => setCreateModalOpen(true)} />
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link key={project.id} to={`/app/projects/${project.id}`}>
                <Card className="group relative overflow-hidden hover:shadow-md transition-all duration-150 cursor-pointer border-border/60 hover:border-primary/30">
                  {/* Color accent bar */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: project.color }}
                  />
                  
                  <CardContent className="p-4 pt-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-lg font-bold text-primary-foreground shadow-sm"
                          style={{ backgroundColor: project.color }}
                        >
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {getOpenTaskCount(project)} open tasks
                          </p>
                        </div>
                      </div>
                      
                      {/* Quick Actions - Show on Hover */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      {/* Members with presence */}
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 4).map((member) => (
                          <Tooltip key={member.id}>
                            <TooltipTrigger asChild>
                              <div>
                                <PresenceAvatar
                                  src={member.avatar}
                                  name={member.name}
                                  size="sm"
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
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                            +{project.members.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Updated {format(new Date(project.updatedAt), 'MMM d')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map((project) => (
              <Link key={project.id} to={`/app/projects/${project.id}`} className="block">
                <Card className="group hover:shadow-sm transition-all duration-150 hover:border-primary/30">
                  <CardContent className="p-3 flex items-center gap-4">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-base font-bold text-primary-foreground shrink-0"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.description}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                      <div className="flex -space-x-1.5">
                        {project.members.slice(0, 3).map((member) => (
                          <PresenceAvatar
                            key={member.id}
                            src={member.avatar}
                            name={member.name}
                            size="sm"
                            status={getRandomStatus(member.id)}
                          />
                        ))}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getOpenTaskCount(project)} open
                      </Badge>
                      <div className="w-20">
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                      <span className="text-xs text-muted-foreground w-20 text-right">
                        {format(new Date(project.updatedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    {/* Quick actions on hover */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>Open</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
};

export default Projects;
