import React, { useState } from 'react';
import { Play, Pause, Plus, Send, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { tasks, projects } from '@/data/mockData';
import { format, startOfWeek, addDays } from 'date-fns';

const Timesheets: React.FC = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedTask, setSelectedTask] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), {
    weekStartsOn: 1,
  });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mock timesheet data
  const timesheetData = tasks.slice(0, 5).map((task) => ({
    task,
    hours: weekDays.map(() => Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0),
  }));

  const getTotalForDay = (dayIndex: number) =>
    timesheetData.reduce((sum, row) => sum + row.hours[dayIndex], 0);

  const getTotalForTask = (taskHours: number[]) =>
    taskHours.reduce((sum, h) => sum + h, 0);

  const weekTotal = timesheetData.reduce(
    (sum, row) => sum + getTotalForTask(row.hours),
    0
  );

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Timesheets"
        description="Track and submit your working hours."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Timesheets' }]} />}
        actions={
          <Button variant="outline">
            <Send className="h-4 w-4 mr-1" />
            Submit Timesheet
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Timer Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Time Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a task..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks.slice(0, 10).map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-3">
                <span className="text-3xl font-mono">{formatTime(timerSeconds)}</span>
                <Button
                  variant={isTimerRunning ? 'destructive' : 'default'}
                  size="lg"
                  onClick={() => {
                    if (isTimerRunning) {
                      setIsTimerRunning(false);
                      clearInterval((window as any).timesheetTimer);
                    } else {
                      if (!selectedTask) return;
                      setIsTimerRunning(true);
                      const interval = setInterval(() => {
                        setTimerSeconds((s) => s + 1);
                      }, 1000);
                      (window as any).timesheetTimer = interval;
                    }
                  }}
                  disabled={!selectedTask && !isTimerRunning}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" /> Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" /> Start
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Input placeholder="Manual entry (e.g., 2h)" className="w-32" />
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Timesheet */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Weekly Timesheet</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekOffset((o) => o - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-40 text-center">
                {format(weekStart, 'MMM d')} -{' '}
                {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekOffset((o) => o + 1)}
                disabled={weekOffset >= 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-48">Task</TableHead>
                    <TableHead className="min-w-16">Project</TableHead>
                    {weekDays.map((day) => (
                      <TableHead key={day.toISOString()} className="text-center min-w-16">
                        <div>{format(day, 'EEE')}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(day, 'd')}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center min-w-16">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheetData.map(({ task, hours }) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {project?.name.substring(0, 10)}
                          </Badge>
                        </TableCell>
                        {hours.map((h, i) => (
                          <TableCell key={i} className="text-center">
                            {h > 0 ? (
                              <Input
                                defaultValue={h}
                                className="w-12 h-8 text-center mx-auto"
                              />
                            ) : (
                              <Input
                                placeholder="-"
                                className="w-12 h-8 text-center mx-auto text-muted-foreground"
                              />
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-medium">
                          {getTotalForTask(hours)}h
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={2} className="font-medium">
                      Daily Total
                    </TableCell>
                    {weekDays.map((_, i) => (
                      <TableCell key={i} className="text-center font-medium">
                        {getTotalForDay(i)}h
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold">{weekTotal}h</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-3xl font-semibold">{weekTotal}h</p>
              <p className="text-xs text-muted-foreground mt-1">of 40h target</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-3xl font-semibold">124h</p>
              <p className="text-xs text-muted-foreground mt-1">of 160h target</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending Approval</p>
              <p className="text-3xl font-semibold">2</p>
              <p className="text-xs text-chart-1 mt-1">timesheets awaiting review</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timesheets;
