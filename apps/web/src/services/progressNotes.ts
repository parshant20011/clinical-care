import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type { ProgressNoteDTO } from "@clinical/shared";

// Progress notes are nested under a resident:
//   GET  /residents/:id/progress-notes
//   POST /residents/:id/progress-notes

const keys = {
  forResident: (residentId: string) => ["progress-notes", residentId] as const,
};

export function useProgressNotes(residentId: string) {
  return useQuery({
    queryKey: keys.forResident(residentId),
    queryFn: () => api.get<ProgressNoteDTO[]>(`/residents/${residentId}/progress-notes`),
    enabled: !!residentId,
  });
}

export function useCreateProgressNote(residentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { category: ProgressNoteDTO["category"]; note: string }) =>
      api.post<ProgressNoteDTO>(`/residents/${residentId}/progress-notes`, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.forResident(residentId) });
    },
  });
}
