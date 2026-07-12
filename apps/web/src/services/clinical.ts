import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type {
  WoundDTO,
  CarePlanDTO,
  ChecklistDTO,
  MovementDTO,
  AssessmentDTO,
  CarePathwayDTO,
  ResidentDoctorDTO,
  ContactDTO,
  CardDTO,
  VitalReadingDTO,
  AnaccDetailDTO,
  ResidentDocumentDTO,
} from "@clinical/shared";

// Every resident-scoped clinical tab reads one list from
// /residents/:id/<resource>. This single hook covers them all; the typed
// wrappers below just fix the resource name and the DTO type.
function useResidentResource<T>(residentId: string, resource: string) {
  return useQuery({
    queryKey: ["resident", residentId, resource],
    queryFn: () => api.get<T>(`/residents/${residentId}/${resource}`),
    enabled: !!residentId,
  });
}

export const useWounds = (id: string) => useResidentResource<WoundDTO[]>(id, "wounds");
export const useCarePlans = (id: string) => useResidentResource<CarePlanDTO[]>(id, "care-plans");
export const useChecklists = (id: string) => useResidentResource<ChecklistDTO[]>(id, "checklists");
export const useMovements = (id: string) => useResidentResource<MovementDTO[]>(id, "movements");
export const useAssessments = (id: string) => useResidentResource<AssessmentDTO[]>(id, "assessments");
export const usePathways = (id: string) => useResidentResource<CarePathwayDTO[]>(id, "pathways");
export const useResidentDoctors = (id: string) => useResidentResource<ResidentDoctorDTO[]>(id, "doctors");
export const useResidentContacts = (id: string) => useResidentResource<ContactDTO[]>(id, "contacts");
export const useResidentCards = (id: string) => useResidentResource<CardDTO[]>(id, "cards");
export const useVitals = (id: string) => useResidentResource<VitalReadingDTO[]>(id, "vitals");
export const useResidentDocuments = (id: string) => useResidentResource<ResidentDocumentDTO[]>(id, "documents");
export const useAnacc = (id: string) => useResidentResource<AnaccDetailDTO | null>(id, "anacc");
