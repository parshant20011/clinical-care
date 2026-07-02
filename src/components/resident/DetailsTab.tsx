import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Heart, AlertTriangle, Calendar, CreditCard, Pencil } from "lucide-react";
import type { Resident } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface DetailsTabProps {
  resident: Resident;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input value={value} readOnly className="mt-1 bg-muted/40" />
    </div>
  );
}

export default function DetailsTab({ resident }: DetailsTabProps) {
  const [firstName, ...rest] = resident.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold">Personal Details</h3>
        <Button onClick={() => toast({ title: "Edit Details", description: "Editing coming soon." })} className="w-full sm:w-auto">
          <Pencil className="h-4 w-4 mr-1" />
          Edit Details
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 pb-3 border-b mb-3">
            <User className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-semibold">Personal Information</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="First Name" value={firstName} />
            <Field label="Last Name" value={lastName || "—"} />
            <Field label="Age" value={`${resident.age} years`} />
            <Field label="Gender" value={resident.gender} />
            <Field label="Nationality" value={resident.nationality ?? "—"} />
            <Field label="Room Number" value={resident.room} />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 pb-3 border-b mb-3">
            <Heart className="h-4 w-4 text-red-500" />
            <p className="text-sm font-semibold">Medical Information</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="Primary Diagnosis" value={resident.diagnosis} />
            </div>
            <Field label="Doctor" value={resident.doctor} />
            <Field label="Weight" value="62.5 kg" />
            <Field label="Care Level" value={resident.careLevel} />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 pb-3 border-b mb-3">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <p className="text-sm font-semibold">Allergies</p>
          </div>
          {resident.allergies.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Resident has nil known allergies.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {resident.allergies.map((a, i) => (
                <Badge key={i} variant="outline" className="bg-red-50 text-red-600 border-transparent">
                  {a.description}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 pb-3 border-b mb-3">
            <Calendar className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-semibold">Admission Details</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Date of Admission" value={resident.doa} />
            <Field label="Status" value={resident.accountStatus} />
          </div>
        </div>

        <div className="border rounded-lg p-4 md:col-span-2">
          <div className="flex items-center gap-2 pb-3 border-b mb-3">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-semibold">Identification Numbers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Medicare Number" value={resident.medicareCard} />
            <Field label="IHI Number" value={resident.ihi} />
            <Field label="Resident ID" value={`R${resident.id.padStart(3, "0")}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
