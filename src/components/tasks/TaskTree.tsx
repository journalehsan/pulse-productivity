import React, { useState } from 'react';
import { Task } from '@/types';
import { TaskRow } from './TaskRow';

interface TaskTreeProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  selectedTaskId?: string;
}

const TaskTreeItem: React.FC<{
  task: Task;
  level: number;
  onSelectTask?: (task: Task) => void;
  selectedTaskId?: string;
  expandedIds: Set<string>;
  toggleExpanded: (id: string) => void;
}> = ({ task, level, onSelectTask, selectedTaskId, expandedIds, toggleExpanded }) => {
  const isExpanded = expandedIds.has(task.id);
  const hasChildren = task.subtasks && task.subtasks.length > 0;

  return (
    <>
      <TaskRow
        task={task}
        level={level}
        isExpanded={isExpanded}
        onToggleExpand={() => toggleExpanded(task.id)}
        onSelect={() => onSelectTask?.(task)}
        isSelected={selectedTaskId === task.id}
        hasChildren={hasChildren}
      />
      {isExpanded && hasChildren && (
        <>
          {task.subtasks!.map((subtask) => (
            <TaskTreeItem
              key={subtask.id}
              task={subtask}
              level={level + 1}
              onSelectTask={onSelectTask}
              selectedTaskId={selectedTaskId}
              expandedIds={expandedIds}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </>
      )}
    </>
  );
};

export const TaskTree: React.FC<TaskTreeProps> = ({
  tasks,
  onSelectTask,
  selectedTaskId,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    const addIds = (taskList: Task[]) => {
      taskList.forEach((task) => {
        if (task.isExpanded) ids.add(task.id);
        if (task.subtasks) addIds(task.subtasks);
      });
    };
    addIds(tasks);
    return ids;
  });

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="divide-y divide-border border-t border-border">
      {tasks.map((task) => (
        <TaskTreeItem
          key={task.id}
          task={task}
          level={0}
          onSelectTask={onSelectTask}
          selectedTaskId={selectedTaskId}
          expandedIds={expandedIds}
          toggleExpanded={toggleExpanded}
        />
      ))}
    </div>
  );
};
