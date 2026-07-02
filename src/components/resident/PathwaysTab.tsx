import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Waypoints, ChevronRight } from "lucide-react";
import { carePathways } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Completed: "bg-blue-50 text-blue-600 border-transparent",
  "In Progress": "bg-green-50 text-green-600 border-transparent",
  "Not Started": "bg-muted text-muted-foreground border-transparent",
};

interface PathwaysTabProps {
  residentId: string;
}

export default function PathwaysTab({ residentId }: PathwaysTabProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const pathways = carePathways.filter((p) => p.residentId === residentId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Care Pathways</h3>
        <Button onClick={() => toast({ title: "Start Pathway", description: "Pathway selection coming soon." })}>
          <Plus className="h-4 w-4 mr-1" />
          Start Pathway
        </Button>
      </div>

      <div className="space-y-3">
        {pathways.map((p) => {
          const percent = p.totalSteps > 0 ? Math.round((p.completedSteps / p.totalSteps) * 100) : 0;
          const isOpen = openId === p.id;
          return (
            <div key={p.id} className="border rounded-lg overflow-hidden">
              <button
                className="w-full text-left p-4 hover:bg-muted/20 transition-colors"
                onClick={() => setOpenId(isOpen ? null : p.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Waypoints className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.completedSteps} of {p.totalSteps} steps completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="outline" className={statusStyles[p.status]}>
                      {p.status}
                    </Badge>
                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-90")} />
                  </div>
                </div>
                {percent > 0 && <Progress value={percent} className="mt-3" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t">
                  <p className="text-sm text-muted-foreground">Pathway steps and details would be displayed here.</p>
                  <Button size="sm" className="mt-3">View Full Pathway</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
