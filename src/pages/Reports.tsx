import React, { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { users, projects, tasks } from '@/data/mockData';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('week');
  const [selectedProject, setSelectedProject] = useState('all');

  // Mock report data
  const userStats = users.slice(0, 4).map((user) => ({
    user,
    tasksCompleted: Math.floor(Math.random() * 20) + 5,
    hoursLogged: Math.floor(Math.random() * 40) + 10,
    efficiency: Math.floor(Math.random() * 30) + 70,
  }));

  const weeklyThroughput = [
    { week: 'Week 1', completed: 12, created: 15 },
    { week: 'Week 2', completed: 18, created: 14 },
    { week: 'Week 3', completed: 15, created: 20 },
    { week: 'Week 4', completed: 22, created: 18 },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Reports"
        description="Track team performance and project progress."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Reports' }]} />}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-3xl font-semibold">{tasks.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-semibold">
                {tasks.filter((t) => t.status === 'done').length}
              </p>
              <p className="text-xs text-chart-2 mt-1">
                +8% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Hours Logged</p>
              <p className="text-3xl font-semibold">156</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across all team members
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg Cycle Time</p>
              <p className="text-3xl font-semibold">3.2d</p>
              <p className="text-xs text-chart-2 mt-1">
                -0.5d from last period
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tasks by User */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tasks Completed by User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.map(({ user, tasksCompleted }) => (
                  <div key={user.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {tasksCompleted} tasks
                      </span>
                    </div>
                    <Progress value={(tasksCompleted / 25) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hours by User */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hours Logged by User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.map(({ user, hoursLogged }) => (
                  <div key={user.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {hoursLogged}h
                      </span>
                    </div>
                    <Progress value={(hoursLogged / 50) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Throughput */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Throughput per Week</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Tasks Created</TableHead>
                  <TableHead className="text-right">Tasks Completed</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyThroughput.map((row) => (
                  <TableRow key={row.week}>
                    <TableCell className="font-medium">{row.week}</TableCell>
                    <TableCell className="text-right">{row.created}</TableCell>
                    <TableCell className="text-right">{row.completed}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={row.completed >= row.created ? 'default' : 'secondary'}
                      >
                        {row.completed >= row.created ? '+' : ''}
                        {row.completed - row.created}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detailed Report Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Detailed Report</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Tasks Completed</TableHead>
                  <TableHead className="text-right">Hours Logged</TableHead>
                  <TableHead className="text-right">Efficiency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStats.map(({ user, tasksCompleted, hoursLogged, efficiency }) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{tasksCompleted}</TableCell>
                    <TableCell className="text-right">{hoursLogged}h</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          efficiency >= 80
                            ? 'text-chart-2'
                            : efficiency >= 60
                            ? 'text-chart-1'
                            : 'text-destructive'
                        }
                      >
                        {efficiency}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
