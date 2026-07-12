import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTasks } from "@/services/tasks";
import QueryState from "@/components/QueryState";
import { cn } from "@/lib/utils";

const priorityConfig = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-slate-700 text-white",
  Medium: "bg-slate-100 text-slate-700",
  Low: "bg-slate-100 text-slate-600",
};

const statusConfig = {
  in_progress: { label: "In Progress", className: "bg-green-100 text-green-700" },
  pending: { label: "Pending", className: "bg-orange-100 text-orange-700" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-700" },
};

export default function TaskOverview() {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading, isError } = useTasks();
  const activeTasks = tasks.filter((t) => t.status !== "completed").slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-base sm:text-lg font-semibold">Active Tasks</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/tasks")}
          className="text-sm text-blue-600 hover:text-blue-700 h-auto p-0"
        >
          View all
        </Button>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          isEmpty={activeTasks.length === 0}
          emptyMessage="No active tasks."
          errorMessage="Couldn't load tasks."
        >
        <div className="space-y-3">
          {activeTasks.map((task) => {
            const status = statusConfig[task.status];
            return (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 rounded-lg border border-slate-200 p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{task.residentName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {task.assignedToName ?? "Unassigned"}
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1.5 shrink-0">
                  <span
                    className={cn(
                      "text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap",
                      priorityConfig[task.priority]
                    )}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap",
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        </QueryState>
      </CardContent>
    </Card>
  );
}
