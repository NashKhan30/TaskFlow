import React, { useState, useEffect } from 'react';
import type { Priority, Category } from '../types/task';
import { useTasks } from '../context/TaskContext';

export interface TaskFormProps {
  onAddTask?: (title: string, priority: Priority, category: Category, dueDate: string) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const { addTask, selectedCategory } = useTasks();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>(
    selectedCategory !== 'All' ? selectedCategory : 'Work'
  );
  const [dueDate, setDueDate] = useState<string>('Today');

  // Auto-sync category if user selected a category from the sidebar
  useEffect(() => {
    if (selectedCategory !== 'All') {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    if (onAddTask) {
      onAddTask(cleanTitle, priority, category, dueDate);
    } else {
      addTask(cleanTitle, priority, category, dueDate);
    }

    setTitle('');
  };

  const priorityStyles =
    priority === 'high'
      ? 'text-rose-500 bg-rose-500/10 border-rose-500/30'
      : priority === 'medium'
      ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl p-2.5 sm:p-3 shadow-md dark:shadow-xl transition-all"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3">
        {/* Left Input Row */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/30 hidden sm:flex">
            <span className="material-symbols-outlined text-[18px]">add_task</span>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done today?"
            className="flex-1 w-full bg-slate-50 sm:bg-transparent dark:bg-slate-900/50 sm:dark:bg-transparent rounded-xl sm:rounded-none px-3 sm:px-2 py-2 sm:py-1.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-medium"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 text-xs shrink-0 overflow-x-auto no-scrollbar pt-1 sm:pt-0">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 pr-6 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors font-semibold min-h-[34px]"
            >
              <option value="Work">🔵 Work</option>
              <option value="Personal">🟢 Personal</option>
              <option value="Study">🟣 Study</option>
              <option value="Health">🔴 Health</option>
              <option value="Finance">🟡 Finance</option>
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Due Date Selector */}
          <div className="relative">
            <select
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 pr-6 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors font-medium min-h-[34px]"
            >
              <option value="Today">📅 Today</option>
              <option value="Tomorrow">⏳ Tomorrow</option>
              <option value="Upcoming">🚀 Upcoming</option>
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Priority Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const next: Record<Priority, Priority> = {
                low: 'medium',
                medium: 'high',
                high: 'low',
              };
              setPriority(next[priority]);
            }}
            className={`flex items-center justify-center border rounded-xl px-2.5 py-1.5 transition-all min-h-[34px] font-bold ${priorityStyles}`}
            title={`Priority: ${priority.toUpperCase()} (Click to toggle)`}
          >
            <span className="material-symbols-outlined text-[16px] mr-1">flag</span>
            <span className="capitalize text-[11px] hidden sm:inline">{priority}</span>
          </button>

          {/* Add Task Button with Gradient */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs px-4 py-1.5 sm:py-2 rounded-xl transition-all shadow-md shadow-purple-500/25 flex items-center gap-1.5 shrink-0 min-h-[34px] active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </form>
  );
};
