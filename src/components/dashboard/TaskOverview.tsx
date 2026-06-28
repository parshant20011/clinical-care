import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { tasks } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: { label: "Pending", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
};

export default function TaskOverview() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          Task Overview
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/tasks")}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {tasks.slice(0, 5).map((task) => {
            const config = statusConfig[task.status];
            return (
              <div
                key={task.id}
                className="flex items-start justify-between px-6 py-3 hover:bg-muted/40 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {task.residentName} · {task.assignedTo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due: {task.dueDate}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap",
                    config.className
                  )}
                >
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
