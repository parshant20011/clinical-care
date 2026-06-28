import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Resident } from "@/data/mockData";

interface DetailsTabProps {
  resident: Resident;
}

export default function DetailsTab({ resident }: DetailsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Full Name", value: resident.name },
            { label: "Preferred Name", value: resident.preferredName || "—" },
            { label: "Date of Birth", value: resident.doa },
            { label: "Age", value: `${resident.age} years` },
            { label: "Gender", value: resident.gender },
            { label: "URN", value: resident.urn },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Admission Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Room", value: resident.room },
            { label: "Admission Date", value: resident.doa },
            { label: "Status", value: resident.status },
            { label: "Residence", value: resident.residence },
            { label: "Medicare Card", value: resident.medicareCard },
            { label: "Concession No.", value: resident.concessionNumber },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Medical</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Primary Diagnosis</span>
            <p className="mt-1 font-medium">{resident.diagnosis}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Allergies</p>
            {resident.allergies.length === 0 ? (
              <p className="text-sm italic text-muted-foreground">
                Resident has nil known allergies.
              </p>
            ) : (
              <div className="space-y-2">
                {resident.allergies.map((allergy, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>
                      <span className="capitalize">{allergy.type}</span>: {allergy.description}
                    </span>
                    <Badge
                      variant={
                        allergy.severity === "High"
                          ? "destructive"
                          : allergy.severity === "Medium"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {allergy.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Care Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: "CPR Status", value: resident.cpr ? "FOR CPR" : "NOT FOR CPR", active: resident.cpr },
            { label: "BGL Monitoring", value: resident.bgl ? "Yes" : "No", active: resident.bgl },
            { label: "Mobile", value: resident.mobile ? "Yes" : "No", active: resident.mobile },
            { label: "IHI", value: resident.ihi },
            { label: "AN-ACC", value: resident.anAcc },
            { label: "On Leave", value: resident.onLeave ? "Yes" : "No", active: resident.onLeave },
          ].map(({ label, value, active }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className={`font-medium ${active === false ? "text-muted-foreground" : ""}`}>
                {value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
