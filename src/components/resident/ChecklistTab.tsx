import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Clock, User } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [localChecklists, setLocalChecklists] = useState(() =>
    checklists
      .filter((c) => c.residentId === residentId)
      .map((c) => ({ ...c, items: c.items.map((i) => ({ ...i })) }))
      .sort((a, b) => b.date.localeCompare(a.date))
  );

  const toggleItem = (checklistId: string, itemId: string) => {
    setLocalChecklists((prev) =>
      prev.map((cl) =>
        cl.id !== checklistId
          ? cl
          : {
              ...cl,
              items: cl.items.map((it) =>
                it.id === itemId ? { ...it, completed: !it.completed } : it
              ),
            }
      )
    );
  };

  const filteredTypes = checklistTypes.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Checklists</h3>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          New Checklist
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search past checklists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTypes.map((type) => {
          const count = localChecklists.filter((c) => c.type === type).length;
          return (
            <button
              key={type}
              className="border rounded-lg p-4 text-left hover:bg-muted/40 transition-colors"
            >
              <p className="text-sm font-medium">{type}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {count} record{count !== 1 ? "s" : ""}
              </p>
            </button>
          );
        })}
      </div>

      {localChecklists.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold">Recent Checklists</p>
          {localChecklists.map((cl) => {
            const allDone = cl.items.every((i) => i.completed);
            const isOpen = openId === cl.id;
            return (
              <div
                key={cl.id}
                className={cn(
                  "border rounded-lg overflow-hidden",
                  isOpen && "ring-1 ring-blue-500"
                )}
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
                  onClick={() => setOpenId(isOpen ? null : cl.id)}
                >
                  <div>
                    <p className="text-sm font-medium">{cl.type}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {cl.date}
                      </span>
                      {cl.completedBy && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {cl.completedBy}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-transparent">
                    {allDone ? "Completed" : "In Progress"}
                  </Badge>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t space-y-2">
                    {cl.items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 cursor-pointer py-1"
                      >
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={item.completed}
                          onChange={() => toggleItem(cl.id, item.id)}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            item.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {item.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
