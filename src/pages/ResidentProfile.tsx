import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { residents } from "@/data/mockData";
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

export default function ResidentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const resident = residents.find((r) => r.id === id);

  if (!resident) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Resident not found.</p>
        <Button onClick={() => navigate("/residents")} className="mt-4">
          Back to Residents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/residents")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Clinical
        </Button>
      </div>

      {/* Resident Header */}
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-semibold shrink-0">
            {resident.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-bold">{resident.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {resident.age} years · Room {resident.room}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last weight: 82.6 kg
                </p>
                <div className="flex gap-2 mt-1">
                  <Badge className="text-xs">{resident.anAcc}</Badge>
                  <Badge variant="outline" className="text-xs">ACD</Badge>
                  <Badge variant="outline" className="text-xs">View</Badge>
                  <span className="text-xs text-muted-foreground self-center">
                    Consented: N/A
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {resident.status}
                </p>
              </div>
              <div className="text-right text-sm space-y-1">
                <p><span className="text-muted-foreground">Room: </span>{resident.room}</p>
                <p><span className="text-muted-foreground">IHI: </span><span className="font-mono text-xs">{resident.ihi}</span></p>
                <p><span className="text-muted-foreground">URN: </span>{resident.urn}</p>
                <p><span className="text-muted-foreground">Medicare: </span>{resident.medicareCard}</p>
                <p><span className="text-muted-foreground">Doctor: </span>{resident.doctor}</p>
                <p><span className="text-muted-foreground">NOK: </span>{resident.nok}</p>
                <p><span className="text-muted-foreground">Concession: </span>{resident.concessionNumber}</p>
                <p><span className="text-muted-foreground">DOA: </span>{resident.doa}</p>
              </div>
            </div>
            {resident.diagnosis && (
              <div className="mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">Diagnosis: </span>
                <span className="text-sm">{resident.diagnosis}</span>
              </div>
            )}
          </div>
          <div className="text-right space-y-1 shrink-0">
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-end gap-1">
                <span className="text-muted-foreground">Allergy</span>
                <span className="text-muted-foreground">AOR</span>
                <span className="text-muted-foreground">From</span>
              </div>
              {resident.allergies.length === 0 ? (
                <span className="text-muted-foreground">Resident has nil known allergies.</span>
              ) : (
                resident.allergies.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{a.type}</span>
                    <span>{a.description}</span>
                    <Badge
                      variant={a.severity === "High" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {a.severity}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {resident.alert && (
          <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-orange-600">
            <AlertTriangle className="h-4 w-4" />
            This resident has active alerts. Please review before providing care.
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="progress-notes" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 rounded-lg overflow-x-auto">
          {[
            { value: "progress-notes", label: "Progress Notes" },
            { value: "checklists", label: "Checklists" },
            { value: "tasks", label: "Tasks" },
            { value: "forms", label: "Forms" },
            { value: "assessments", label: "Assessments" },
            { value: "pathways", label: "Pathways" },
            { value: "charts", label: "Charts" },
            { value: "care-plan", label: "Care Plan" },
            { value: "an-acc", label: "AN-ACC" },
            { value: "active-wounds", label: "Active Wounds" },
            { value: "movements", label: "Movements" },
            { value: "document", label: "Document" },
            { value: "details", label: "Details" },
            { value: "cards", label: "Cards" },
            { value: "doctors", label: "Doctors" },
            { value: "contacts", label: "Contacts" },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs whitespace-nowrap">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="progress-notes">
          <ProgressNotesTab residentId={resident.id} />
        </TabsContent>
        <TabsContent value="checklists">
          <ChecklistTab residentId={resident.id} />
        </TabsContent>
        <TabsContent value="tasks">
          <AssignTaskTab residentId={resident.id} />
        </TabsContent>
        <TabsContent value="forms">
          <FormsTab />
        </TabsContent>
        <TabsContent value="assessments">
          <AssessmentTab />
        </TabsContent>
        <TabsContent value="pathways">
          <PathwaysTab />
        </TabsContent>
        <TabsContent value="charts">
          <ChartsTab />
        </TabsContent>
        <TabsContent value="care-plan">
          <CarePlanTab residentId={resident.id} />
        </TabsContent>
        <TabsContent value="an-acc">
          <ANACCTab resident={resident} />
        </TabsContent>
        <TabsContent value="active-wounds">
          <WoundsTab residentId={resident.id} />
        </TabsContent>
        <TabsContent value="movements">
          <MovementTab residentId={resident.id} />
        </TabsContent>
        <TabsContent value="document">
          <DocumentsTab />
        </TabsContent>
        <TabsContent value="details">
          <DetailsTab resident={resident} />
        </TabsContent>
        <TabsContent value="cards">
          <CardsTab resident={resident} />
        </TabsContent>
        <TabsContent value="doctors">
          <DoctorsTab resident={resident} />
        </TabsContent>
        <TabsContent value="contacts">
          <ContactsTab resident={resident} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
