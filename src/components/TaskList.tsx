import React from 'react';
import type { Task } from '../types/task';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from './TaskItem';

export interface TaskListProps {
  tasks?: Task[];
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = (props) => {
  const context = useTasks();

  const tasks = props.tasks ?? context.tasks;
  const onToggle = props.onToggle ?? context.toggleTask;
  const onDelete = props.onDelete ?? context.deleteTask;

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-outline-variant/30 rounded-2xl p-6">
        <span className="material-symbols-outlined text-outline text-5xl mb-2">task</span>
        <p className="text-sm text-on-surface-variant">No tasks found. Add a task to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
