import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Hospital, Home, ArrowLeftRight } from "lucide-react";
import { movementTypes } from "@clinical/shared";
import { useMovements } from "@/services/clinical";
import QueryState from "@/components/QueryState";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const iconFor = (type: string) => {
  const lower = type.toLowerCase();
  if (lower.includes("return") || lower.includes("home")) return { Icon: Home, bg: "bg-orange-50", color: "text-orange-600" };
  if (lower.includes("transfer") || lower.includes("hospital")) return { Icon: Hospital, bg: "bg-red-50", color: "text-red-600" };
  return { Icon: ArrowLeftRight, bg: "bg-blue-50", color: "text-blue-600" };
};

interface MovementTabProps {
  residentId: string;
}

export default function MovementTab({ residentId }: MovementTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");

  const { data: movements = [], isLoading, isError } = useMovements(residentId);

  const residentMovements = [...movements].sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time)
  );

  const handleSave = () => {
    if (!type) return;
    toast({ title: "Movement logged", description: `${type} recorded successfully.` });
    setType("");
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold">Movement Log</h3>
        <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" />
          Log Movement
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium">New Movement</p>
          <div>
            <Label className="text-xs">Movement Type</Label>
            <div className="mt-1 border rounded-lg divide-y max-h-60 overflow-y-auto">
              {movementTypes.map((mt) => (
                <label
                  key={mt}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <input
                    type="radio"
                    name="movementType"
                    value={mt}
                    onChange={() => setType(mt)}
                    checked={type === mt}
                  />
                  <span className="text-sm">{mt}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Date</Label>
              <Input type="date" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Time</Label>
              <Input type="time" className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea placeholder="Add notes..." rows={2} className="mt-1" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" onClick={handleSave}>Save Movement</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isEmpty={residentMovements.length === 0}
        emptyMessage="No movements recorded."
      >
        <div className="space-y-0">
          {residentMovements.map((m, i) => {
            const { Icon, bg, color } = iconFor(m.type);
            const isLast = i === residentMovements.length - 1;
            return (
              <div key={m.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", bg)}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-border my-1" />}
                </div>
                <div className={cn("flex-1 min-w-0", !isLast && "pb-6")}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold">{m.type}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(m.date).toLocaleDateString("en-AU")} · {m.time}
                      </p>
                      <p className="text-sm mt-1.5">{m.note}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{m.recordedBy}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </QueryState>
    </div>
  );
}
