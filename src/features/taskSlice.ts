import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, Priority, Category } from '../types/task';
import { fetchRemoteTasks, createRemoteTask, updateRemoteTask, deleteRemoteTask } from '../api/taskApi';

export interface TaskState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Finalize quarterly marketing roadmap',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: 'Today',
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Review UI design system updates',
    completed: false,
    priority: 'medium',
    category: 'Personal',
    dueDate: 'Tomorrow',
    createdAt: Date.now() - 1000,
  },
  {
    id: '3',
    title: 'Update onboarding and API documentation',
    completed: true,
    priority: 'low',
    category: 'Study',
    dueDate: 'Today',
    createdAt: Date.now() - 2000,
  },
];

const getSavedTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem('taskflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
};

const initialState: TaskState = {
  items: getSavedTasks(),
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const remoteTasks = await fetchRemoteTasks();
  return remoteTasks;
});

export const addTaskAsync = createAsyncThunk(
  'tasks/addTaskAsync',
  async (payload: { title: string; priority: Priority; category: Category }) => {
    await createRemoteTask(payload);
    return payload;
  }
);

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<{ title: string; priority: Priority; category: Category; dueDate?: string }>
    ) => {
      const newTask: Task = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        title: action.payload.title,
        completed: false,
        priority: action.payload.priority,
        category: action.payload.category,
        dueDate: action.payload.dueDate || 'Today',
        createdAt: Date.now(),
      };
      state.items.unshift(newTask);
      localStorage.setItem('taskflow_tasks', JSON.stringify(state.items));
    },

    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.items.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('taskflow_tasks', JSON.stringify(state.items));
        updateRemoteTask(task.id, task.completed).catch(console.warn);
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      localStorage.setItem('taskflow_tasks', JSON.stringify(state.items));
      deleteRemoteTask(action.payload).catch(console.warn);
    },

    clearCompleted: (state) => {
      state.items = state.items.filter((t) => !t.completed);
      localStorage.setItem('taskflow_tasks', JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        localStorage.setItem('taskflow_tasks', JSON.stringify(state.items));
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tasks';
      });
  },
});

export const { addTask, toggleTask, deleteTask, clearCompleted } = taskSlice.actions;
export default taskSlice.reducer;
