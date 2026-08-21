export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string; // e.g. 'Today', 'Tomorrow', 'Upcoming', '2026-08-22'
  createdAt: number;
}
