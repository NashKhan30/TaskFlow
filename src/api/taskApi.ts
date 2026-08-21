import { apiClient } from './axiosInstance';
import type { Task, Priority, Category } from '../types/task';

interface JsonPlaceholderTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export async function fetchRemoteTasks(): Promise<Task[]> {
  const response = await apiClient.get<JsonPlaceholderTodo[]>('/todos?_limit=6');

  const priorities: Priority[] = ['high', 'medium', 'low', 'medium', 'high', 'low'];
  const categories: Category[] = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Work'];

  return response.data.map((item, index) => ({
    id: item.id.toString(),
    title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
    completed: item.completed,
    priority: priorities[index % priorities.length],
    category: categories[index % categories.length],
    dueDate: index % 2 === 0 ? 'Today' : 'Upcoming',
    createdAt: Date.now() - index * 3600000,
  }));
}

export async function createRemoteTask(taskData: {
  title: string;
  priority: Priority;
  category: Category;
}): Promise<{ id: number; title: string; completed: boolean }> {
  const response = await apiClient.post('/todos', {
    title: taskData.title,
    completed: false,
    userId: 1,
  });
  return response.data;
}

export async function updateRemoteTask(id: string, completed: boolean): Promise<void> {
  const targetId = isNaN(Number(id)) ? 1 : Number(id);
  await apiClient.patch(`/todos/${targetId}`, { completed });
}

export async function deleteRemoteTask(id: string): Promise<void> {
  const targetId = isNaN(Number(id)) ? 1 : Number(id);
  await apiClient.delete(`/todos/${targetId}`);
}
