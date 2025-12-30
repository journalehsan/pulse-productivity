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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { tasks, activityEvents, users, getTaskStats, currentUser } from '@/data/mockData';
import { format } from 'date-fns';

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
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
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
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your tasks."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Dashboard' }]} />}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* My Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">My Tasks</CardTitle>
              <Link to="/app/projects">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        task.priority === 'urgent'
                          ? 'bg-destructive'
                          : task.priority === 'high'
                          ? 'bg-chart-1'
                          : 'bg-muted-foreground'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.dueDate
                          ? `Due ${format(new Date(task.dueDate), 'MMM d')}`
                          : 'No due date'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityEvents.slice(0, 6).map((event) => {
                  const user = users.find((u) => u.id === event.userId);
                  return (
                    <div key={event.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xs">
                          {user?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{user?.name}</span>{' '}
                          <span className="text-muted-foreground">
                            {event.description}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Charts Placeholder */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tasks by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Backlog', value: 30, color: 'bg-muted-foreground' },
                  { label: 'In Progress', value: 45, color: 'bg-chart-1' },
                  { label: 'Review', value: 15, color: 'bg-chart-3' },
                  { label: 'Done', value: 70, color: 'bg-chart-2' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="text-muted-foreground">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className={`h-2 ${item.color}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Throughput</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-chart-1 rounded-t transition-all hover:bg-chart-1/80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.slice(0, 4).map((user) => {
                  const completed = Math.floor(Math.random() * 15) + 5;
                  return (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {completed} tasks completed
                        </p>
                      </div>
                      <Badge variant="secondary">{completed}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
