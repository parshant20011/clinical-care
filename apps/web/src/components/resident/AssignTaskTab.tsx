import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useResidents } from "@/services/residents";
import { useTasks, useCreateTask, useStaff } from "@/services/tasks";
import { cn } from "@/lib/utils";
import { Send, CalendarDays } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const priorities = ["Low", "Medium", "High", "Urgent"] as const;

const statusColors = {
  pending: "bg-orange-100 text-orange-700",
  in_progress: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-700",
};

interface AssignTaskTabProps {
  residentId: string;
}

export default function AssignTaskTab({ residentId }: AssignTaskTabProps) {
  const { data: residents = [] } = useResidents();
  const { data: staffUsers = [] } = useStaff();
  const { data: residentTasks = [] } = useTasks(residentId);
  const createTask = useCreateTask();

  const [selectedResident, setSelectedResident] = useState(residentId);
  const [staffMember, setStaffMember] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<typeof priorities[number]>("Medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    if (!selectedResident || !staffMember || !description.trim()) return;
    createTask.mutate(
      {
        residentId: selectedResident,
        assignedToId: staffMember,
        title: description,
        priority,
        dueDate: dueDate || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: "Task Created", description: "The task has been assigned successfully." });
          setStaffMember("");
          setDescription("");
          setPriority("Medium");
          setDueDate("");
        },
        onError: (err) =>
          toast({
            title: "Could not create task",
            description: err instanceof Error ? err.message : undefined,
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base sm:text-lg font-bold">Assign Task</h3>

      <div className="space-y-4 max-w-2xl">
        <div>
          <Label className="text-sm font-medium">Resident</Label>
          <Select value={selectedResident} onValueChange={setSelectedResident}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select resident" />
            </SelectTrigger>
            <SelectContent>
              {residents.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name} - Room {r.room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Assign to Staff</Label>
          <Select value={staffMember} onValueChange={setStaffMember}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staffUsers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} — {s.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Task Description</Label>
          <Textarea
            placeholder="Describe the task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as typeof priorities[number])}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Due Date</Label>
          <div className="relative mt-1.5">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleSubmit} disabled={createTask.isPending}>
          <Send className="h-4 w-4 mr-2" />
          {createTask.isPending ? "Assigning…" : "Assign Task"}
        </Button>
      </div>

      {residentTasks.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-sm font-semibold">Assigned Tasks</p>
          {residentTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Assigned to: {task.assignedToName ?? "Unassigned"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-AU") : "—"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium capitalize whitespace-nowrap",
                      statusColors[task.status as keyof typeof statusColors]
                    )}
                  >
                    {task.status === "in_progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
