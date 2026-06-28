import { Users, ClipboardList, AlertTriangle, CheckCircle } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import ResidentSummary from "@/components/dashboard/ResidentSummary";
import TaskOverview from "@/components/dashboard/TaskOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { residents, tasks } from "@/data/mockData";

export default function Dashboard() {
  const totalResidents = residents.length;
  const onLeave = residents.filter((r) => r.onLeave).length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const overdueTasks = tasks.filter((t) => t.status === "overdue").length;
  const alertResidents = residents.filter((r) => r.alert).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Clinical Overview — {new Date().toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          title="Total Residents"
          value={totalResidents}
          subtitle={`${onLeave} on leave`}
          icon={Users}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle={`${overdueTasks} overdue`}
          icon={ClipboardList}
          iconColor="text-orange-600"
        />
        <StatsCard
          title="Alerts"
          value={alertResidents}
          subtitle="Residents with alerts"
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        <StatsCard
          title="Completed Today"
          value={tasks.filter((t) => t.status === "completed").length}
          subtitle="Tasks completed"
          icon={CheckCircle}
          iconColor="text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ResidentSummary />
        <TaskOverview />
      </div>

      <RecentActivity />
    </div>
  );
}
