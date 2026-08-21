import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Task, Priority, Category } from '../types/task';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { fetchRemoteTasks, createRemoteTask, updateRemoteTask, deleteRemoteTask } from '../api/taskApi';

export interface TaskContextType {
  tasks: Task[];
  pendingCount: number;
  completedCount: number;
  highPriorityCount: number;
  todayCount: number;
  upcomingCount: number;
  categoryCounts: Record<Category, number>;
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  isSyncing: boolean;
  addTask: (title: string, priority?: Priority, category?: Category, dueDate?: string) => Promise<void>;
  editTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearCompleted: () => void;
  clearAllTasks: () => void;
  syncFromApi: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Helper to filter out any leftover dummy starter tasks stored in browser cache
const sanitizeStoredTasks = (storageKey: string): Task[] => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return [];
    const parsed: Task[] = JSON.parse(saved);
    // Remove legacy starter sample tasks
    const cleaned = parsed.filter(
      (t) =>
        !t.id.startsWith('starter_') &&
        t.title !== 'Finalize Q3 Marketing Strategy Presentation' &&
        t.title !== 'Review UI Design System Updates' &&
        t.title !== 'Update Onboarding Documentation'
    );
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(storageKey, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const storageKey = user ? `taskflow_tasks_${user.id}` : 'taskflow_tasks_guest';

  const [tasks, setTasks] = useState<Task[]>(() => sanitizeStoredTasks(storageKey));
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync tasks on mount / user change, auto-purging old dummy data
  useEffect(() => {
    setTasks(sanitizeStoredTasks(storageKey));
  }, [storageKey, user?.id]);

  const updateAndPersistTasks = (updater: (prev: Task[]) => Task[]) => {
    setTasks((prev) => {
      const updated = updater(prev);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.error('[TaskContext] Error persisting tasks:', e);
      }
      return updated;
    });
  };

  const syncFromApi = async () => {
    try {
      setIsSyncing(true);
      const apiTasks = await fetchRemoteTasks();
      updateAndPersistTasks(() => apiTasks);
      showToast('Synced tasks with cloud server!', 'info');
    } catch (error) {
      console.error('[TaskContext] Failed to fetch remote tasks:', error);
      showToast('Cloud sync failed. Working in offline mode.', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  // 1. CREATE Task
  const addTask = async (
    title: string,
    priority: Priority = 'medium',
    category: Category = 'Work',
    dueDate = 'Today'
  ) => {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      completed: false,
      priority,
      category,
      dueDate,
      createdAt: Date.now(),
    };

    updateAndPersistTasks((prev) => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" added successfully!`, 'success');

    try {
      await createRemoteTask({ title, priority, category });
    } catch (error) {
      console.warn('[TaskContext] Remote create simulation:', error);
    }
  };

  // 2. UPDATE Task (Edit fields)
  const editTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    updateAndPersistTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
    showToast('Task updated successfully!', 'success');

    if (updates.completed !== undefined) {
      try {
        await updateRemoteTask(id, updates.completed);
      } catch (error) {
        console.warn('[TaskContext] Remote update simulation:', error);
      }
    }
  };

  // 3. TOGGLE Task Completion
  const toggleTask = async (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    const nextCompleted = targetTask ? !targetTask.completed : true;

    updateAndPersistTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    if (nextCompleted) {
      showToast('Task marked as completed! 🎉', 'success');
    } else {
      showToast('Task reopened and marked active', 'info');
    }

    try {
      await updateRemoteTask(id, nextCompleted);
    } catch (error) {
      console.warn('[TaskContext] Remote update simulation:', error);
    }
  };

  // 4. DELETE Task
  const deleteTask = async (id: string) => {
    updateAndPersistTasks((prev) => prev.filter((task) => task.id !== id));
    showToast('Task deleted successfully!', 'info');

    try {
      await deleteRemoteTask(id);
    } catch (error) {
      console.warn('[TaskContext] Remote delete simulation:', error);
    }
  };

  const clearCompleted = () => {
    const count = tasks.filter((t) => t.completed).length;
    updateAndPersistTasks((prev) => prev.filter((task) => !task.completed));
    showToast(`Cleared ${count} completed task${count > 1 ? 's' : ''}!`, 'info');
  };

  const clearAllTasks = () => {
    updateAndPersistTasks(() => []);
    showToast('All tasks cleared from workspace!', 'info');
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.length - pendingCount;
  const highPriorityCount = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const todayCount = tasks.filter((t) => t.dueDate.toLowerCase() === 'today').length;
  const upcomingCount = tasks.filter((t) => t.dueDate.toLowerCase() !== 'today').length;

  const categoryCounts: Record<Category, number> = {
    Work: tasks.filter((t) => t.category === 'Work').length,
    Personal: tasks.filter((t) => t.category === 'Personal').length,
    Study: tasks.filter((t) => t.category === 'Study').length,
    Health: tasks.filter((t) => t.category === 'Health').length,
    Finance: tasks.filter((t) => t.category === 'Finance').length,
  };

  const value: TaskContextType = {
    tasks,
    pendingCount,
    completedCount,
    highPriorityCount,
    todayCount,
    upcomingCount,
    categoryCounts,
    selectedCategory,
    setSelectedCategory,
    isSyncing,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    clearAllTasks,
    syncFromApi,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
