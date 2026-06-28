import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { movements, movementTypes } from "@/data/mockData";

interface MovementTabProps {
  residentId: string;
}

export default function MovementTab({ residentId }: MovementTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("");
  const residentMovements = movements.filter((m) => m.residentId === residentId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">
          Movement History ({residentMovements.length})
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" />
          New Movement
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200">
          <CardContent className="p-4 space-y-3">
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
            <div className="grid grid-cols-2 gap-3">
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
            <div className="flex gap-2">
              <Button size="sm">Save Movement</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {residentMovements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No movements recorded.
          </p>
        ) : (
          residentMovements.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{m.type}</p>
                    <p className="text-sm mt-1">{m.note}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {m.date} {m.time} · {m.recordedBy}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
