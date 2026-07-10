import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BedDouble, Calendar, Clock } from "lucide-react";
import { wounds } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const statusStyles: Record<string, string> = {
  active: "bg-red-50 text-red-600 border-transparent",
  healing: "bg-green-50 text-green-600 border-transparent",
  healed: "bg-blue-50 text-blue-600 border-transparent",
  archived: "bg-muted text-muted-foreground border-transparent",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  healing: "Healing",
  healed: "Healed",
  archived: "Archived",
};

interface WoundsTabProps {
  residentId: string;
}

export default function WoundsTab({ residentId }: WoundsTabProps) {
  const residentWounds = wounds.filter((w) => w.residentId === residentId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold">Active Wounds</h3>
        <Button onClick={() => toast({ title: "New wound record started" })} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" />
          Record New Wound
        </Button>
      </div>

      {residentWounds.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No active wounds recorded.
        </p>
      ) : (
        <div className="space-y-3">
          {residentWounds.map((wound) => (
            <div key={wound.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <BedDouble className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <p className="text-sm font-semibold">{wound.location}</p>
                    <Badge variant="outline" className={cn(statusStyles[wound.status])}>
                      {statusLabels[wound.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{wound.woundType}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Discovered: {wound.startedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last assessed: {wound.lastReview}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
