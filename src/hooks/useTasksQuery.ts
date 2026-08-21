import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRemoteTasks, createRemoteTask, updateRemoteTask, deleteRemoteTask } from '../api/taskApi';
import type { Priority, Category } from '../types/task';

export const TASK_QUERY_KEY = ['tasks'] as const;

export function useTasksQuery() {
  return useQuery({
    queryKey: TASK_QUERY_KEY,
    queryFn: fetchRemoteTasks,
  });
}

export function useAddTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTask: { title: string; priority: Priority; category: Category }) =>
      createRemoteTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
  });
}

export function useToggleTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateRemoteTask(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRemoteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEY });
    },
  });
}
