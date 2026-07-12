import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, ChevronRight, User, Clock } from "lucide-react";
import type { TaskDTO } from "@clinical/shared";
import { useTasks, useCreateTask, useUpdateTask, useStaff } from "@/services/tasks";
import { useResidents } from "@/services/residents";
import QueryState from "@/components/QueryState";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import TaskDetailDialog from "@/components/tasks/TaskDetailDialog";

const statusColors = {
  pending: "bg-orange-100 text-orange-700",
  in_progress: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-700",
};

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-AU") : "—";

const emptyForm = {
  title: "",
  residentId: "",
  assignedToId: "",
  dueDate: "",
  priority: "Medium" as TaskDTO["priority"],
};

export default function Tasks() {
  const { data: tasks = [], isLoading, isError } = useTasks();
  const { data: residents = [] } = useResidents();
  const { data: staff = [] } = useStaff();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [status, setStatus] = useState<"all" | TaskDTO["status"]>("all");
  const [priority, setPriority] = useState<"all" | TaskDTO["priority"]>("all");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = tasks.filter((t) => {
    const matchStatus = status === "all" || t.status === status;
    const matchPriority = priority === "all" || t.priority === priority;
    const q = search.toLowerCase();
    const matchSearch =
      t.title.toLowerCase().includes(q) ||
      t.residentName.toLowerCase().includes(q) ||
      (t.assignedToName ?? "").toLowerCase().includes(q);
    return matchStatus && matchPriority && matchSearch;
  });

  function markComplete(id: string) {
    updateTask.mutate(
      { id, input: { status: "completed" } },
      {
        onSuccess: (updated) => {
          toast({ title: "Task completed" });
          setSelectedTask((prev) => (prev && prev.id === id ? updated : prev));
        },
        onError: () => toast({ title: "Could not update task", variant: "destructive" }),
      },
    );
  }

  function handleCreateTask() {
    if (!form.title || !form.residentId || !form.assignedToId) return;
    createTask.mutate(
      {
        residentId: form.residentId,
        title: form.title,
        assignedToId: form.assignedToId,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: "Task created" });
          setForm(emptyForm);
          setNewOpen(false);
        },
        onError: (err) =>
          toast({
            title: "Could not create task",
            description: err instanceof Error ? err.message : undefined,
            variant: "destructive",
          }),
      },
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks, residents, or staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Priorities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setNewOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" />
          New Task
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {tasks.length} tasks
      </p>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isEmpty={filtered.length === 0}
        emptyMessage="No tasks found."
        errorMessage="Couldn't load tasks."
      >
      <div className="space-y-3">
        {filtered.map((task) => (
          <Card
            key={task.id}
            className="cursor-pointer hover:bg-muted/40 transition-colors"
            onClick={() => setSelectedTask(task)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{task.title}</p>
                    <span className="text-xs text-muted-foreground">{task.priority}</span>
                  </div>
                  {task.notes && (
                    <p className="text-xs text-muted-foreground">{task.notes}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" /> {task.residentName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" /> {task.assignedToName ?? "Unassigned"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due: {fmtDate(task.dueDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColors[task.status])}>
                    {task.status === "in_progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </QueryState>

      <TaskDetailDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onMarkComplete={markComplete}
      />

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Task Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Resident</Label>
              <Select value={form.residentId} onValueChange={(v) => setForm({ ...form, residentId: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Choose resident" /></SelectTrigger>
                <SelectContent>
                  {residents.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Assign To</Label>
                <Select
                  value={form.assignedToId}
                  onValueChange={(v) => setForm({ ...form, assignedToId: v })}
                >
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose staff" /></SelectTrigger>
                  <SelectContent>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TaskDTO["priority"] })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Due Date</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTask} disabled={createTask.isPending}>
              {createTask.isPending ? "Creating…" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
