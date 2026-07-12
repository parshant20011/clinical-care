import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type {
  ResidentListItem,
  ResidentDetail,
  CreateResidentInput,
} from "@clinical/shared";

// Data hooks for the residents resource. Components call these instead of
// importing mockData arrays — the JSX stays almost identical because the DTO
// field names match what the UI already used.

const keys = {
  all: ["residents"] as const,
  detail: (id: string) => ["residents", id] as const,
};

export function useResidents() {
  return useQuery({
    queryKey: keys.all,
    queryFn: () => api.get<ResidentListItem[]>("/residents"),
  });
}

export function useResident(id: string | undefined) {
  return useQuery({
    queryKey: keys.detail(id ?? ""),
    queryFn: () => api.get<ResidentDetail>(`/residents/${id}`),
    enabled: !!id,
  });
}

export function useCreateResident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateResidentInput) =>
      api.post<ResidentDetail>("/residents", input),
    onSuccess: () => {
      // Refetch the list so the new resident appears immediately.
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}
