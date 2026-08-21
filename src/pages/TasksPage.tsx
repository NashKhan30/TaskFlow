import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks, isDateToday } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';
import { TaskForm } from '../components/TaskForm';
import { TaskItem } from '../components/TaskItem';
import type { Priority, Category } from '../types/task';

type FilterTab = 'all' | 'today' | 'upcoming' | 'completed';
type SortOption = 'priority' | 'date' | 'title';

export const TasksPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    tasks,
    pendingCount,
    completedCount,
    highPriorityCount,
    selectedCategory,
    setSelectedCategory,
    toggleTask,
    deleteTask,
    clearCompleted,
    clearAllTasks,
    addTask,
  } = useTasks();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilter = searchParams.get('filter') as FilterTab | null;

  const [activeTab, setActiveTab] = useState<FilterTab>(
    urlFilter && ['all', 'today', 'upcoming', 'completed'].includes(urlFilter)
      ? urlFilter
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Sync URL search parameters with active tab
  useEffect(() => {
    if (urlFilter && ['all', 'today', 'upcoming', 'completed'].includes(urlFilter)) {
      setActiveTab(urlFilter);
    }
  }, [urlFilter]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    if (tab === 'all') {
      searchParams.delete('filter');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ filter: tab }, { replace: true });
    }
  };

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Priyanshu';

  // 300ms Debounced search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

    return tasks
      .filter((task) => {
        // 1. Tab status filter
        if (activeTab === 'completed' && !task.completed) return false;
        if (activeTab === 'today' && !isDateToday(task.dueDate)) return false;
        if (activeTab === 'upcoming' && isDateToday(task.dueDate)) return false;

        // 2. Category filter from sidebar
        if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;

        // 3. Search query filter
        if (debouncedSearch.trim() !== '') {
          const q = debouncedSearch.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesCategory = task.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return b.createdAt - a.createdAt;
      });
  }, [tasks, activeTab, selectedCategory, debouncedSearch, sortBy]);

  const handleToggle = useCallback((id: string) => toggleTask(id), [toggleTask]);
  const handleDelete = useCallback((id: string) => deleteTask(id), [deleteTask]);

  // When adding a task: ensure filters do not hide the newly created task
  const handleAddTask = (title: string, priority: Priority, category: Category, dueDate: string) => {
    addTask(title, priority, category, dueDate);

    if (selectedCategory !== 'All' && selectedCategory !== category) {
      setSelectedCategory('All');
    }
    if (activeTab === 'completed') {
      handleTabChange('all');
    }
    if (activeTab === 'today' && !isDateToday(dueDate)) {
      handleTabChange('all');
    }
    if (activeTab === 'upcoming' && isDateToday(dueDate)) {
      handleTabChange('all');
    }
  };

  const tabGradients: Record<FilterTab, string> = {
    all: 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/25',
    today: 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/25',
    upcoming: 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/25',
    completed: 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/25',
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 box-border overflow-hidden">
      {/* 1. Header Greeting & Actions */}
      <div className="flex items-center justify-between gap-3 w-full max-w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 font-geist tracking-tight truncate">
            <span>{greeting}, {firstName}!</span>
            <span>👋</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            Let's make today productive and organized.
          </p>
        </div>

        {/* Top Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white items-center justify-center transition-all shadow-sm cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Search Toggle */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 w-36 xs:w-44 sm:w-64 shadow-sm animate-fadeIn">
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-slate-400 mr-1.5">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  autoFocus
                  className="bg-transparent text-base sm:text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none w-full font-medium"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchInput(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs ml-1 cursor-pointer"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearchInput(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                title="Search tasks"
              >
                <span className="material-symbols-outlined text-[17px] sm:text-[18px]">search</span>
              </button>
            )}
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all shadow-sm relative cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[18px]">notifications</span>
            {pendingCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-[#070b14] animate-pulse"></span>
            )}
          </button>

          {/* User Profile Avatar Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 border border-purple-400/40 text-white font-bold text-xs flex items-center justify-center overflow-hidden transition-all shadow-sm cursor-pointer"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Task Creation Input Bar */}
      <TaskForm onAddTask={handleAddTask} />

      {/* 3. Four Distinct Colorful Metric Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-full">
        {/* Card 1: Total Tasks (Royal Purple/Violet Theme) */}
        <div className="relative bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-950/30 dark:via-[#0b1120] dark:to-[#0b1120] border border-purple-200 dark:border-purple-800/40 hover:border-purple-400 dark:hover:border-purple-500/60 rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden shadow-sm dark:shadow-lg transition-all group hover:-translate-y-0.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">inbox</span>
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-geist truncate">{tasks.length}</div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 truncate">Total Tasks</div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>

        {/* Card 2: Completed (Neon Emerald Theme) */}
        <div className="relative bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/30 dark:via-[#0b1120] dark:to-[#0b1120] border border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-400 dark:hover:border-emerald-500/60 rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden shadow-sm dark:shadow-lg transition-all group hover:-translate-y-0.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">task_alt</span>
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-geist truncate">{completedCount}</div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 truncate">Completed</div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        </div>

        {/* Card 3: In Progress (Sunset Amber/Orange Theme) */}
        <div className="relative bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-[#0b1120] dark:to-[#0b1120] border border-amber-200 dark:border-amber-800/40 hover:border-amber-400 dark:hover:border-amber-500/60 rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden shadow-sm dark:shadow-lg transition-all group hover:-translate-y-0.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">pending_actions</span>
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-geist truncate">{pendingCount}</div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 truncate">In Progress</div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        </div>

        {/* Card 4: High Priority (Electric Rose/Crimson Theme) */}
        <div className="relative bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-950/30 dark:via-[#0b1120] dark:to-[#0b1120] border border-rose-200 dark:border-rose-800/40 hover:border-rose-400 dark:hover:border-rose-500/60 rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden shadow-sm dark:shadow-lg transition-all group hover:-translate-y-0.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">local_fire_department</span>
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-geist truncate">{highPriorityCount}</div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 truncate">High Priority</div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
        </div>
      </div>

      {/* 4. Filter & Sort Horizontal Capsule Bar */}
      <div className="w-full max-w-full bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 shadow-sm dark:shadow-md box-border">
        {/* Left Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all' as FilterTab, label: 'All Tasks', icon: 'grid_view' },
            { id: 'today' as FilterTab, label: 'Today', icon: 'wb_sunny' },
            { id: 'upcoming' as FilterTab, label: 'Upcoming', icon: 'calendar_month' },
            { id: 'completed' as FilterTab, label: 'Completed', icon: 'task_alt' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? `${tabGradients[tab.id]} text-white shadow-md font-bold`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Sort Controls & Active Category Indicator */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto pt-1 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          {selectedCategory !== 'All' && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-xl text-[11px] font-bold border border-indigo-500/30">
              <span>Category: {selectedCategory}</span>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="hover:text-slate-900 dark:hover:text-white ml-0.5 text-sm cursor-pointer"
                title="Clear category filter"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-auto md:ml-0">
            <span className="font-semibold">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-1 pr-6 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-semibold"
              >
                <option value="priority">🔥 Priority</option>
                <option value="date">⚡ Newest</option>
                <option value="title">🔤 Alphabetical</option>
              </select>
              <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-slate-400 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Tasks List or Colorful Empty State */}
      <div className="w-full max-w-full space-y-2.5 sm:space-y-3 box-border">
        {filteredTasks.length === 0 ? (
          <div className="w-full bg-white dark:bg-[#0b1120]/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 sm:space-y-4 my-4 sm:my-8 shadow-sm box-border">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-500 shadow-xl shadow-purple-500/20">
              <span className="material-symbols-outlined text-[28px] sm:text-[32px]">checklist_rtl</span>
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-geist">No tasks found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedCategory !== 'All'
                  ? `No tasks in the "${selectedCategory}" category.`
                  : activeTab !== 'all'
                  ? `No tasks under the "${activeTab}" tab.`
                  : 'Add a new task above to get started and stay productive!'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (selectedCategory !== 'All') setSelectedCategory('All');
                if (activeTab !== 'all') handleTabChange('all');
                const input = document.querySelector('input[placeholder*="What"]') as HTMLInputElement;
                input?.focus();
              }}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Create Your First Task</span>
            </button>
          </div>
        ) : (
          <div className="w-full max-w-full space-y-2.5 box-border">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Action Buttons: Clear Completed & Clear All */}
        {tasks.length > 0 && (
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            {completedCount > 0 && (
              <button
                type="button"
                onClick={clearCompleted}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline transition-colors flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">done_all</span>
                <span>Clear Completed ({completedCount})</span>
              </button>
            )}
            <button
              type="button"
              onClick={clearAllTasks}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
