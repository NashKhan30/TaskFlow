import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { TaskForm } from '../components/TaskForm';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, pendingCount, completedCount } = useTasks();

  const highPriorityCount = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const recentTasks = [...tasks].slice(0, 4);

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header */}
      <header className="bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/20 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface">Dashboard</h1>
          <p className="text-xs text-on-surface-variant">Welcome back, {user?.name || 'User'}! Here is your productivity summary.</p>
        </div>
        <Link
          to="/tasks"
          className="bg-primary text-on-primary font-medium text-xs md:text-sm px-4 py-2 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md shadow-primary/10"
        >
          <span className="material-symbols-outlined text-[18px]">list_alt</span>
          View All Tasks
        </Link>
      </header>

      {/* Main Dashboard Grid */}
      <div className="p-4 md:p-8 max-w-5xl w-full mx-auto space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Tasks</span>
              <span className="material-symbols-outlined text-primary text-[20px]">assignment</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-on-surface">{tasks.length}</div>
          </div>

          {/* Card 2: Pending */}
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pending</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">hourglass_top</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-secondary">{pendingCount}</div>
          </div>

          {/* Card 3: Completed */}
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Completed</span>
              <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-on-surface">{completedCount}</div>
          </div>

          {/* Card 4: High Priority */}
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-error uppercase tracking-wider">High Priority</span>
              <span className="material-symbols-outlined text-error text-[20px]">warning</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-error">{highPriorityCount}</div>
          </div>
        </div>

        {/* Progress Overview Bar */}
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5 md:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-on-surface">Overall Completion Rate</span>
            <span className="text-primary font-bold">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Add Form Section */}
        <div className="space-y-3">
          <h2 className="text-sm uppercase tracking-wider font-semibold text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Quick Create Task
          </h2>
          <TaskForm />
        </div>

        {/* Recent Tasks List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-on-surface-variant">
              Recent Tasks
            </h2>
            <Link to="/tasks" className="text-xs text-primary hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-outline-variant/30 rounded-2xl text-on-surface-variant text-sm">
              No tasks created yet. Use the form above to add your first task!
            </div>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-3.5 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        t.completed ? 'text-primary' : 'text-outline'
                      }`}
                    >
                      {t.completed ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className={t.completed ? 'line-through text-on-surface-variant' : 'text-on-surface font-medium'}>
                      {t.title}
                    </span>
                  </div>
                  {t.priority && (
                    <span className="text-xs capitalize text-on-surface-variant">
                      {t.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
