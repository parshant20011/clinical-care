import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Phone, Mail } from "lucide-react";
import type { Resident } from "@/data/mockData";

interface DoctorsTabProps {
  resident: Resident;
}

export default function DoctorsTab({ resident }: DoctorsTabProps) {
  const doctors = [
    { name: resident.doctor, role: "General Practitioner", phone: "(08) 8200 0000", email: "gp@clinic.com.au", primary: true },
    { name: "Dr. Sarah Lee", role: "Geriatrician", phone: "(08) 8200 1111", email: "geriatrics@hospital.com.au", primary: false },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Doctor
        </Button>
      </div>
      <div className="space-y-3">
        {doctors.map((doc, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{doc.name}</p>
                    {doc.primary && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Primary GP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{doc.role}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {doc.phone}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {doc.email}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">Visit Notes</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
