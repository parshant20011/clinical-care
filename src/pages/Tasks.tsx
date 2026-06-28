import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { tasks } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusColors = {
  pending: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
};

export default function Tasks() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all");
  const [search, setSearch] = useState("");

  const filtered = tasks.filter((t) => {
    const matchFilter = filter === "all" || t.status === filter;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.residentName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {counts.pending} pending · {counts.overdue} overdue
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "overdue", "completed"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f} ({counts[f]})
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Resident: {task.residentName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Assigned to: {task.assignedTo} · Area: {task.area}
                  </p>
                  <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                  {task.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">{task.notes}</p>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium capitalize whitespace-nowrap",
                    statusColors[task.status]
                  )}
                >
                  {task.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tasks found.
          </p>
        )}
      </div>
    </div>
  );
}
