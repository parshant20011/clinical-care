import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Phone, Mail, Building2, Star } from "lucide-react";
import { residentDoctors, type ResidentDoctor, type Resident } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DoctorsTabProps {
  resident: Resident;
}

export default function DoctorsTab({ resident }: DoctorsTabProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ResidentDoctor | null>(null);

  const doctors = residentDoctors
    .filter((d) => d.residentId === resident.id)
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold">Doctors</h3>
        <Button onClick={() => toast({ title: "Add Doctor", description: "Doctor form coming soon." })} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" />
          Add Doctor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className={cn(
              "border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/20 transition-colors",
              doc.primary && "ring-1 ring-blue-500"
            )}
            onClick={() => setSelected(doc)}
          >
            <div className="h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-semibold shrink-0">
              {doc.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{doc.name}</p>
                {doc.primary && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-transparent text-xs">
                    <Star className="h-3 w-3 mr-1 fill-blue-600" />
                    Primary
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{doc.specialty}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Building2 className="h-3 w-3" />
                {doc.facility}
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast({ title: "Calling…", description: doc.phone })}
              >
                <Phone className="h-3.5 w-3.5 mr-1" />
                Call
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast({ title: "Opening email…", description: doc.email })}
              >
                <Mail className="h-3.5 w-3.5 mr-1" />
                Email
              </Button>
            </div>
          </div>
        ))}
        {doctors.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No doctors found.</p>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold shrink-0">
                  {selected.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">{selected.specialty}</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg px-4 py-3 flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {selected.phone}
              </div>
              <div className="bg-muted/50 rounded-lg px-4 py-3 flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {selected.email}
              </div>
              <div className="bg-muted/50 rounded-lg px-4 py-3 flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {selected.facility}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
