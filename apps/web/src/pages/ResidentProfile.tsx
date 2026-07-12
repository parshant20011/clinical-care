import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, User, Calendar, Weight, Loader2 } from "lucide-react";
import { residentDoctors, residentContacts, weightReadings, anaccDetails } from "@/data/mockData";
import { useResident } from "@/services/residents";
import ProgressNotesTab from "@/components/resident/ProgressNotesTab";
import ChecklistTab from "@/components/resident/ChecklistTab";
import AssignTaskTab from "@/components/resident/AssignTaskTab";
import FormsTab from "@/components/resident/FormsTab";
import AssessmentTab from "@/components/resident/AssessmentTab";
import PathwaysTab from "@/components/resident/PathwaysTab";
import ChartsTab from "@/components/resident/ChartsTab";
import CarePlanTab from "@/components/resident/CarePlanTab";
import ANACCTab from "@/components/resident/ANACCTab";
import WoundsTab from "@/components/resident/WoundsTab";
import MovementTab from "@/components/resident/MovementTab";
import DocumentsTab from "@/components/resident/DocumentsTab";
import DetailsTab from "@/components/resident/DetailsTab";
import CardsTab from "@/components/resident/CardsTab";
import DoctorsTab from "@/components/resident/DoctorsTab";
import ContactsTab from "@/components/resident/ContactsTab";

const careLevelStyles: Record<string, string> = {
  High: "bg-red-50 text-red-600 border-red-200",
  Medium: "bg-orange-50 text-orange-600 border-orange-200",
  Low: "bg-green-50 text-green-600 border-green-200",
};

export default function ResidentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: resident, isLoading, isError } = useResident(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError || !resident) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Resident not found.</p>
        <Button onClick={() => navigate("/residents")} className="mt-4">
          Back to Residents
        </Button>
      </div>
    );
  }

  // These sub-resources still come from mock data — they are migrated to the
  // API in later slices of the strangler-fig rollout, and degrade gracefully
  // (undefined) until then.
  const primaryDoctor = residentDoctors.find((d) => d.residentId === resident.id && d.primary);
  const primaryContact = residentContacts.find((c) => c.residentId === resident.id && c.primary);
  const latestWeight = weightReadings.filter((w) => w.residentId === resident.id).at(-1);
  const anacc = anaccDetails.find((a) => a.residentId === resident.id);

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate("/residents")}
        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Residents
      </button>

      {/* Resident Header */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <div className="flex items-start justify-between gap-4 sm:gap-6 p-4 sm:p-6 flex-wrap">
          <div className="flex items-start gap-4 min-w-0">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold shrink-0">
              {resident.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold">{resident.name}</h2>
                <Badge variant="outline" className={careLevelStyles[resident.careLevel]}>
                  {resident.careLevel} Care
                </Badge>
                <Badge className="bg-blue-600 hover:bg-blue-600 text-white">
                  {resident.accountStatus}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{resident.diagnosis}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {resident.age} years, {resident.gender}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Admitted {new Date(resident.dateOfAdmission).toLocaleDateString("en-AU")}
                </span>
                {latestWeight && (
                  <span className="flex items-center gap-1.5">
                    <Weight className="h-3.5 w-3.5" />
                    {latestWeight.value} kg
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0 w-full lg:w-auto">
            <div className="bg-muted/50 rounded-lg px-4 py-2.5 min-w-32">
              <p className="text-xs text-muted-foreground">Doctor</p>
              <p className="text-sm font-semibold mt-0.5">{primaryDoctor?.name ?? "—"}</p>
            </div>
            <div className="bg-muted/50 rounded-lg px-4 py-2.5 min-w-32">
              <p className="text-xs text-muted-foreground">Medicare</p>
              <p className="text-sm font-semibold mt-0.5">{resident.medicareCard}</p>
            </div>
            <div className="bg-muted/50 rounded-lg px-4 py-2.5 min-w-32">
              <p className="text-xs text-muted-foreground">IHI Status</p>
              <p className="text-sm font-semibold mt-0.5">{anacc?.ihiVerified ? "Verified" : "Not Verified"}</p>
            </div>
            <div className="bg-muted/50 rounded-lg px-4 py-2.5 min-w-32">
              <p className="text-xs text-muted-foreground">Emergency Contact</p>
              <p className="text-sm font-semibold mt-0.5 flex items-center gap-1">
                {primaryContact?.phone ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {resident.allergies.length > 0 && (
          <div className="mx-4 sm:mx-6 mb-4 sm:mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-600">Allergies</p>
              <p className="text-sm text-red-600/90">
                {resident.allergies.map((a) => a.description).join(", ")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <Tabs defaultValue="progress-notes">
          <TabsList className="flex w-full h-auto justify-start overflow-x-auto rounded-none border-b bg-transparent p-0 px-1 sm:px-2">
            {[
              { value: "progress-notes", label: "Progress Notes" },
              { value: "checklists", label: "Checklist" },
              { value: "tasks", label: "Assign Task" },
              { value: "forms", label: "Forms" },
              { value: "assessments", label: "Assessment" },
              { value: "pathways", label: "Pathways" },
              { value: "charts", label: "Charts" },
              { value: "care-plan", label: "Care Plan" },
              { value: "an-acc", label: "AN-ACC" },
              { value: "active-wounds", label: "Active Wound" },
              { value: "movements", label: "Movement" },
              { value: "document", label: "Documents" },
              { value: "details", label: "Details" },
              { value: "cards", label: "Cards" },
              { value: "doctors", label: "Doctors" },
              { value: "contacts", label: "Contacts" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-muted-foreground data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="p-4 sm:p-6">
            <TabsContent value="progress-notes" className="mt-0">
              <ProgressNotesTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="checklists" className="mt-0">
              <ChecklistTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="tasks" className="mt-0">
              <AssignTaskTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="forms" className="mt-0">
              <FormsTab />
            </TabsContent>
            <TabsContent value="assessments" className="mt-0">
              <AssessmentTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="pathways" className="mt-0">
              <PathwaysTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="charts" className="mt-0">
              <ChartsTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="care-plan" className="mt-0">
              <CarePlanTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="an-acc" className="mt-0">
              <ANACCTab resident={resident} />
            </TabsContent>
            <TabsContent value="active-wounds" className="mt-0">
              <WoundsTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="movements" className="mt-0">
              <MovementTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="document" className="mt-0">
              <DocumentsTab residentId={resident.id} />
            </TabsContent>
            <TabsContent value="details" className="mt-0">
              <DetailsTab resident={resident} />
            </TabsContent>
            <TabsContent value="cards" className="mt-0">
              <CardsTab resident={resident} />
            </TabsContent>
            <TabsContent value="doctors" className="mt-0">
              <DoctorsTab resident={resident} />
            </TabsContent>
            <TabsContent value="contacts" className="mt-0">
              <ContactsTab resident={resident} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
