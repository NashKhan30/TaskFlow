import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import type { Category } from '../types/task';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    tasks,
    pendingCount,
    todayCount,
    upcomingCount,
    completedCount,
    categoryCounts,
    selectedCategory,
    setSelectedCategory,
  } = useTasks();

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/tasks',
      label: 'My Tasks',
      icon: 'check_circle',
      count: pendingCount,
      activeColor: 'from-indigo-500 to-purple-600',
    },
    {
      to: '/tasks?filter=today',
      label: 'Today',
      icon: 'wb_sunny',
      count: todayCount,
      activeColor: 'from-amber-500 to-orange-600',
    },
    {
      to: '/tasks?filter=upcoming',
      label: 'Upcoming',
      icon: 'calendar_month',
      count: upcomingCount,
      activeColor: 'from-blue-500 to-indigo-600',
    },
    {
      to: '/tasks?filter=completed',
      label: 'Completed',
      icon: 'task_alt',
      count: completedCount,
      activeColor: 'from-emerald-500 to-teal-600',
    },
    {
      to: '/tasks?filter=all',
      label: 'All Tasks',
      icon: 'inbox',
      count: tasks.length,
      activeColor: 'from-purple-500 to-pink-600',
    },
  ];

  const categories: { name: Category; color: string; bgBadge: string; textBadge: string; emoji: string }[] = [
    { name: 'Work', color: 'bg-blue-500', bgBadge: 'bg-blue-500/10 text-blue-500', textBadge: 'text-blue-500', emoji: '💼' },
    { name: 'Personal', color: 'bg-emerald-500', bgBadge: 'bg-emerald-500/10 text-emerald-500', textBadge: 'text-emerald-500', emoji: '🌿' },
    { name: 'Study', color: 'bg-purple-500', bgBadge: 'bg-purple-500/10 text-purple-500', textBadge: 'text-purple-500', emoji: '📚' },
    { name: 'Health', color: 'bg-rose-500', bgBadge: 'bg-rose-500/10 text-rose-500', textBadge: 'text-rose-500', emoji: '❤️' },
    { name: 'Finance', color: 'bg-amber-500', bgBadge: 'bg-amber-500/10 text-amber-500', textBadge: 'text-amber-500', emoji: '💰' },
  ];

  const currentPath = location.pathname + location.search;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-inter antialiased transition-colors duration-200 selection:bg-purple-500/30">
      {/* 1. Desktop Sticky Left Sidebar */}
      <aside className="hidden lg:flex bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800/80 w-64 flex-col p-4 shrink-0 h-screen sticky top-0 justify-between transition-colors shadow-sm dark:shadow-none z-30">
        <div className="space-y-6 overflow-y-auto no-scrollbar">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight font-geist">
                TaskFlow
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>

          {/* Primary Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.to === '/tasks'
                  ? currentPath === '/tasks' || currentPath === '/'
                  : currentPath === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${item.activeColor} text-white shadow-md font-bold`
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-lg font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80'
                    }`}
                  >
                    {item.count}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Categories Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Categories
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                {categories.length}
              </span>
            </div>

            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;

                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(isSelected ? 'All' : cat.name);
                      if (!location.pathname.startsWith('/tasks')) {
                        navigate('/tasks');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold ring-1 ring-slate-300 dark:ring-slate-700 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{cat.emoji}</span>
                      <span className="font-semibold">{cat.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cat.bgBadge}`}>
                      {categoryCounts[cat.name]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Prominent Logout Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all shadow-sm active:scale-95 border border-rose-500/20"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile & Tablet Top App Bar */}
      <header className="lg:hidden bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Open menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
            </div>
            <span className="font-extrabold text-base bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-geist">
              TaskFlow
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all"
            title="Toggle theme"
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* User Initial Avatar in Header */}
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            ) : (
              (user?.name ? user.name.charAt(0).toUpperCase() : 'P')
            )}
          </div>
        </div>
      </header>

      {/* 3. Mobile Slide-out Drawer with Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          ></div>

          {/* Drawer Sidebar */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between h-full z-10 shadow-2xl animate-slideRight">
            <div className="space-y-5 overflow-y-auto no-scrollbar">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  </div>
                  <span className="font-extrabold text-base bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-geist">
                    TaskFlow
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* User Profile Card in Drawer */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/20">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 font-bold flex items-center justify-center shrink-0 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    (user?.name ? user.name.charAt(0).toUpperCase() : 'P')
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@taskflow.io'}</p>
                </div>
              </div>

              {/* Nav Items */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    item.to === '/tasks'
                      ? currentPath === '/tasks' || currentPath === '/'
                      : currentPath === item.to;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${item.activeColor} text-white font-bold shadow-md`
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span className="text-xs font-bold">{item.count}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Categories in Drawer */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2 block">
                  Categories
                </span>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.name;

                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(isSelected ? 'All' : cat.name);
                          setMobileDrawerOpen(false);
                          if (!location.pathname.startsWith('/tasks')) {
                            navigate('/tasks');
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                          isSelected
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm">{cat.emoji}</span>
                          <span className="font-semibold">{cat.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cat.bgBadge}`}>
                          {categoryCounts[cat.name]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Logout button at bottom of drawer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all border border-rose-500/20"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto pb-16 lg:pb-0 bg-slate-50 dark:bg-[#070b14] transition-colors duration-200">
        <Outlet />
      </main>

      {/* 5. Mobile Bottom Floating Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive && !currentPath.includes('filter=')
                ? 'text-indigo-500 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="text-[10px] mt-0.5">Tasks</span>
        </NavLink>

        <NavLink
          to="/tasks?filter=today"
          className={() =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              currentPath.includes('filter=today')
                ? 'text-amber-500 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">wb_sunny</span>
          <span className="text-[10px] mt-0.5">Today</span>
        </NavLink>

        <button
          type="button"
          onClick={() => {
            const input = document.querySelector('input[placeholder*="What"]') as HTMLInputElement;
            input?.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-10 h-10 -mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/40 flex items-center justify-center active:scale-90 transition-transform"
          title="Add task"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
        </button>

        <NavLink
          to="/tasks?filter=upcoming"
          className={() =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              currentPath.includes('filter=upcoming')
                ? 'text-blue-500 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          <span className="text-[10px] mt-0.5">Upcoming</span>
        </NavLink>

        <NavLink
          to="/tasks?filter=completed"
          className={() =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              currentPath.includes('filter=completed')
                ? 'text-emerald-500 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">task_alt</span>
          <span className="text-[10px] mt-0.5">Done</span>
        </NavLink>
      </div>
    </div>
  );
};
