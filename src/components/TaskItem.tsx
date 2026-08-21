import React, { memo, useState } from 'react';
import type { Task, Priority, Category } from '../types/task';
import { useTasks } from '../context/TaskContext';

export interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
}

// 🎨 Distinct Vibrant Category Badges
const CATEGORY_COLORS: Record<Category, { badge: string; text: string; bg: string; dot: string }> = {
  Work: {
    badge: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/25',
    text: 'text-blue-500',
    bg: 'bg-blue-500',
    dot: 'bg-blue-500',
  },
  Personal: {
    badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    text: 'text-emerald-500',
    bg: 'bg-emerald-500',
    dot: 'bg-emerald-500',
  },
  Study: {
    badge: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/25',
    text: 'text-purple-500',
    bg: 'bg-purple-500',
    dot: 'bg-purple-500',
  },
  Health: {
    badge: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/25',
    text: 'text-rose-500',
    bg: 'bg-rose-500',
    dot: 'bg-rose-500',
  },
  Finance: {
    badge: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25',
    text: 'text-amber-500',
    bg: 'bg-amber-500',
    dot: 'bg-amber-500',
  },
};

// 🎨 Distinct Priority Accents & Border Strips
const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; badge: string; borderStrip: string; checkGlow: string }
> = {
  high: {
    label: 'High',
    badge: 'text-rose-600 dark:text-rose-400 bg-rose-500/15 border-rose-500/30 ring-1 ring-rose-500/20',
    borderStrip: 'border-l-rose-500 dark:border-l-rose-500',
    checkGlow: 'bg-rose-500 border-rose-500 shadow-rose-500/40',
  },
  medium: {
    label: 'Medium',
    badge: 'text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30 ring-1 ring-amber-500/20',
    borderStrip: 'border-l-amber-500 dark:border-l-amber-500',
    checkGlow: 'bg-amber-500 border-amber-500 shadow-amber-500/40',
  },
  low: {
    label: 'Low',
    badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30 ring-1 ring-emerald-500/20',
    borderStrip: 'border-l-emerald-500 dark:border-l-emerald-500',
    checkGlow: 'bg-emerald-500 border-emerald-500 shadow-emerald-500/40',
  },
};

export const TaskItem: React.FC<TaskItemProps> = memo(({ task, onToggle, onDelete, onEdit }) => {
  const { editTask } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editCategory, setEditCategory] = useState<Category>(task.category);
  const [editDueDate, setEditDueDate] = useState<string>(task.dueDate);

  const categoryInfo = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.Work;
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTitle = editTitle.trim();
    if (!cleanTitle) return;

    const updates = {
      title: cleanTitle,
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate,
    };

    if (onEdit) {
      onEdit(task.id, updates);
    } else {
      editTask(task.id, updates);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-[#0f172a] border-2 border-indigo-500/70 rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3 animate-fadeIn"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">edit</span>
            Editing Task
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="submit"
              disabled={!editTitle.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-indigo-500/25 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">check</span>
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
              <span>Cancel</span>
            </button>
          </div>
        </div>

        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title..."
          autoFocus
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
        />

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Picker */}
          <div className="relative">
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as Category)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 pr-6 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="Work">Work (Blue)</option>
              <option value="Personal">Personal (Green)</option>
              <option value="Study">Study (Purple)</option>
              <option value="Health">Health (Rose)</option>
              <option value="Finance">Finance (Amber)</option>
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Due Date Picker */}
          <div className="relative">
            <select
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 pr-6 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="Upcoming">Upcoming</option>
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-slate-400 pointer-events-none">
              calendar_today
            </span>
          </div>

          {/* Priority Picker */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setEditPriority(p)}
                className={`capitalize px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  editPriority === p
                    ? p === 'high'
                      ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/40'
                      : p === 'medium'
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/40'
                      : 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/40'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`group relative bg-white dark:bg-[#0b1120] border-y border-r border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all shadow-sm dark:shadow-md border-l-4 ${
        priorityInfo.borderStrip
      } ${
        task.completed
          ? 'opacity-55 bg-slate-50 dark:bg-[#080d1a]/60 border-l-slate-400 dark:border-l-slate-600'
          : 'hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      {/* Custom Checkbox */}
      <label className="relative cursor-pointer p-0.5 flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/35'
              : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/50'
          }`}
        >
          {task.completed && (
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </label>

      {/* Task Content */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex flex-col min-w-0">
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={`text-xs sm:text-sm font-medium transition-all break-words cursor-pointer ${
              task.completed
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title="Double-click or tap edit to modify"
          >
            {task.title}
          </span>

          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
            {/* Category Tag with Colored Bullet */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${categoryInfo.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${categoryInfo.dot}`}></span>
              <span>{task.category}</span>
            </span>

            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline-block"></span>

            {/* Due Date */}
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[13px] text-indigo-400">calendar_today</span>
              {task.dueDate}
            </span>
          </div>
        </div>

        {/* Priority Badge */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${priorityInfo.badge}`}>
            {priorityInfo.label}
          </span>
        </div>
      </div>

      {/* Action Buttons (Edit + Delete) */}
      <div className="flex items-center gap-1 shrink-0 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 transition-colors"
          title="Edit Task"
        >
          <span className="material-symbols-outlined text-[17px] sm:text-[18px]">edit</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15 transition-colors"
          title="Delete Task"
        >
          <span className="material-symbols-outlined text-[17px] sm:text-[18px]">delete</span>
        </button>
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';
