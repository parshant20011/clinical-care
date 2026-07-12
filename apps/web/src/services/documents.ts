import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type { FacilityDocumentDTO } from "@clinical/shared";

// Facility-wide document repository (the Documents page).
export function useFacilityDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: () => api.get<FacilityDocumentDTO[]>("/documents"),
  });
}
