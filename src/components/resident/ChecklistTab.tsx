import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Circle, Plus } from "lucide-react";
import { checklists } from "@/data/mockData";
import { cn } from "@/lib/utils";

const checklistTypes = [
  "Acute Respiration Infection",
  "Behaviour of Concerns Incident Checklist",
  "New Admission Checklist",
  "Post Fall Incidents Checklist",
  "Return from Hospital",
  "Room Change Checklist",
  "Skin Integrity Incident Checklist",
];

interface ChecklistTabProps {
  residentId: string;
}

export default function ChecklistTab({ residentId }: ChecklistTabProps) {
  const [filter, setFilter] = useState("all");
  const residentChecklists = checklists.filter((c) => c.residentId === residentId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {checklistTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Checklist
        </Button>
      </div>

      <div className="space-y-3">
        {residentChecklists.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No checklists found.
          </p>
        ) : (
          residentChecklists.map((cl) => (
            <Card key={cl.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{cl.type}</CardTitle>
                  <span className="text-xs text-muted-foreground">{cl.date}</span>
                </div>
                {cl.completedBy && (
                  <p className="text-xs text-muted-foreground">By: {cl.completedBy}</p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {cl.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className={cn("text-sm", item.completed && "line-through text-muted-foreground")}>
                          {item.name}
                        </p>
                        {item.completedAt && (
                          <p className="text-xs text-muted-foreground">{item.completedAt}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {residentChecklists.length === 0 && (
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Available Checklists</p>
            <div className="space-y-1">
              {checklistTypes.map((type) => (
                <div key={type} className="text-sm text-muted-foreground py-1 border-b last:border-0 cursor-pointer hover:text-foreground transition-colors">
                  {type}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
