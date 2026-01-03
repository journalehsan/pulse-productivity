import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProjectCalendar } from '@/components/calendar/ProjectCalendar';
import { tasks } from '@/data/mockData';

const Calendar: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Calendar"
        description="View all your tasks and deadlines"
      />
      <div className="flex-1 p-6">
        <ProjectCalendar 
          tasks={tasks} 
          onTaskClick={(task) => console.log('Task clicked:', task)}
        />
      </div>
    </div>
  );
};

export default Calendar;
