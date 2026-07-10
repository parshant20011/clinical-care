import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusColors = {
  pending: "bg-orange-100 text-orange-700",
  in_progress: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-700",
};

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkComplete: (id: string) => void;
}

export default function TaskDetailDialog({ task, open, onOpenChange, onMarkComplete }: TaskDetailDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{task.priority} Priority</span>
          <Badge className={cn("text-xs", statusColors[task.status])}>
            {task.status === "in_progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
        </div>
        <div className="rounded-md bg-muted p-3">
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <p className="text-sm">{task.notes || "No description provided."}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Resident</p>
            <p className="text-sm font-medium">{task.residentName}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Assigned To</p>
            <p className="text-sm font-medium">{task.assignedTo}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="text-sm font-medium">{task.dueDate}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Created By</p>
            <p className="text-sm font-medium">{task.createdBy}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={task.status === "completed"}
            onClick={() => onMarkComplete(task.id)}
          >
            Mark Complete
          </Button>
          <Button onClick={() => onOpenChange(false)}>Edit Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
