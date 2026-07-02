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
import { tasks as initialTasks, residents, type Task } from "@/data/mockData";
import { cn } from "@/lib/utils";
import TaskDetailDialog from "@/components/tasks/TaskDetailDialog";

const statusColors = {
  pending: "bg-orange-100 text-orange-700",
  in_progress: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-700",
};

const roles = [
  "Registered Nurse", "Enrolled Nurse", "Care Manager", "Physiotherapist",
  "Occupational Therapist", "Podiatrist", "Dietitian", "GP", "Social Worker",
];

const emptyForm = { title: "", residentId: "", assignedTo: "", dueDate: "", priority: "Medium" as Task["priority"] };

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [status, setStatus] = useState<"all" | Task["status"]>("all");
  const [priority, setPriority] = useState<"all" | Task["priority"]>("all");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = tasks.filter((t) => {
    const matchStatus = status === "all" || t.status === status;
    const matchPriority = priority === "all" || t.priority === priority;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.residentName.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  function markComplete(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t)));
    setSelectedTask((prev) => (prev && prev.id === id ? { ...prev, status: "completed" } : prev));
  }

  function handleCreateTask() {
    const resident = residents.find((r) => r.id === form.residentId);
    if (!form.title || !resident || !form.assignedTo || !form.dueDate) return;
    const newTask: Task = {
      id: `t${Date.now()}`,
      residentId: resident.id,
      residentName: resident.name,
      title: form.title,
      assignedTo: form.assignedTo,
      area: resident.residence,
      status: "pending",
      dueDate: form.dueDate,
      priority: form.priority,
      createdBy: "Sarah Johnson",
    };
    setTasks((prev) => [newTask, ...prev]);
    setForm(emptyForm);
    setNewOpen(false);
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
                      <User className="h-3 w-3" /> {task.assignedTo}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due: {task.dueDate}
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
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tasks found.
          </p>
        )}
      </div>

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
                <Select value={form.assignedTo} onValueChange={(v) => setForm({ ...form, assignedTo: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Task["priority"] })}>
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
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
