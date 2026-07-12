import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type {
  TaskDTO,
  CreateTaskInput,
  UpdateTaskInput,
  StaffDTO,
  DashboardStats,
  ActivityItemDTO,
} from "@clinical/shared";

const taskKeys = {
  all: ["tasks"] as const,
  byResident: (residentId: string) => ["tasks", { residentId }] as const,
};

// residentId omitted → all tasks in the facility (Tasks page, dashboard).
export function useTasks(residentId?: string) {
  return useQuery({
    queryKey: residentId ? taskKeys.byResident(residentId) : taskKeys.all,
    queryFn: () =>
      api.get<TaskDTO[]>(residentId ? `/tasks?residentId=${residentId}` : "/tasks"),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => api.post<TaskDTO>("/tasks", input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      api.patch<TaskDTO>(`/tasks/${id}`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () => api.get<StaffDTO[]>("/staff"),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => api.get<DashboardStats>("/dashboard/stats"),
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: () => api.get<ActivityItemDTO[]>("/dashboard/activity"),
  });
}
