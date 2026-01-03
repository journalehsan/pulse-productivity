import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PresenceAvatar, getRandomStatus } from '@/components/common/PresenceAvatar';
import { AISuggestionsPanel, SmartSuggestionsButton } from '@/components/common/AIFeaturePlaceholders';
import { tasks, activityEvents, users, getTaskStats, currentUser } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const stats = getTaskStats();
  const myTasks = tasks.filter((t) =>
    t.assignees.some((a) => a.id === currentUser.id) && t.status !== 'done'
  );

  const statCards = [
    {
      title: 'Due Today',
      value: stats.dueToday,
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: TrendingUp,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      title: 'Completed This Week',
      value: stats.completedThisWeek,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your tasks."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Dashboard' }]} />}
        actions={<SmartSuggestionsButton />}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2.5 rounded-lg', stat.bgColor)}>
                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* My Tasks */}
          <Card className="lg:col-span-2 border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">My Tasks</CardTitle>
              <Link to="/app/projects">
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {myTasks.slice(0, 6).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full shrink-0',
                        task.priority === 'urgent'
                          ? 'bg-destructive'
                          : task.priority === 'high'
                          ? 'bg-chart-1'
                          : task.priority === 'medium'
                          ? 'bg-chart-5'
                          : 'bg-muted-foreground'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {task.dueDate
                          ? `Due ${format(new Date(task.dueDate), 'MMM d')}`
                          : 'No due date'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions Panel */}
          <AISuggestionsPanel />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Team Activity */}
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityEvents.slice(0, 5).map((event) => {
                  const user = users.find((u) => u.id === event.userId);
                  return (
                    <div key={event.id} className="flex gap-3">
                      <PresenceAvatar
                        src={user?.avatar}
                        name={user?.name || 'User'}
                        size="md"
                        status={getRandomStatus(user?.id || '')}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{user?.name}</span>{' '}
                          <span className="text-muted-foreground">
                            {event.description}
                          </span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {format(new Date(event.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 4).map((user) => {
                  const completed = Math.floor(Math.random() * 15) + 5;
                  const target = 20;
                  const percentage = Math.round((completed / target) * 100);
                  return (
                    <div key={user.id} className="flex items-center gap-3">
                      <PresenceAvatar
                        src={user.avatar}
                        name={user.name}
                        size="md"
                        status={getRandomStatus(user.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <span className="text-xs text-muted-foreground">{completed}/{target}</span>
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Tasks by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Backlog', value: 30, color: 'bg-muted-foreground' },
                  { label: 'In Progress', value: 45, color: 'bg-primary' },
                  { label: 'Review', value: 15, color: 'bg-chart-3' },
                  { label: 'Done', value: 70, color: 'bg-green-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn('h-full rounded-full transition-all', item.color)}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Weekly Throughput</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1.5 h-32">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary rounded-t-sm transition-all duration-200 hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-0.5">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Urgent', count: 3, color: 'bg-destructive' },
                  { label: 'High', count: 8, color: 'bg-chart-1' },
                  { label: 'Medium', count: 12, color: 'bg-chart-5' },
                  { label: 'Low', count: 5, color: 'bg-muted-foreground' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className={cn('h-2.5 w-2.5 rounded-full', item.color)} />
                    <span className="text-sm flex-1">{item.label}</span>
                    <Badge variant="secondary" className="text-xs px-1.5">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
