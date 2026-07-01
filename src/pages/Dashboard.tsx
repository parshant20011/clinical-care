import { Users, ClipboardList, FileSearch, BedDouble, HeartPulse, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import ResidentSummary from "@/components/dashboard/ResidentSummary";
import TaskOverview from "@/components/dashboard/TaskOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { residents, tasks, wounds } from "@/data/mockData";

export default function Dashboard() {
  const totalResidents = residents.length;
  const activeTasks = tasks.filter((t) => t.status !== "completed").length;
  const pendingAssessments = tasks.filter((t) => t.status === "pending").length;
  const activeWounds = wounds.filter((w) => w.status === "active").length;
  const highCare = residents.filter((r) => r.careLevel === "High").length;
  const urgentTasks = tasks.filter((t) => t.priority === "Urgent").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard title="Total Residents" value={totalResidents} icon={Users} iconColor="text-blue-600" tint="blue" />
        <StatsCard title="Active Tasks" value={activeTasks} icon={ClipboardList} iconColor="text-blue-600" />
        <StatsCard title="Pending Assessments" value={pendingAssessments} icon={FileSearch} iconColor="text-blue-600" />
        <StatsCard title="Active Wounds" value={activeWounds} icon={BedDouble} iconColor="text-red-600" tint="red" />
        <StatsCard title="High Care" value={highCare} icon={HeartPulse} iconColor="text-orange-600" />
        <StatsCard title="Urgent Tasks" value={urgentTasks} icon={AlertTriangle} iconColor="text-red-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ResidentSummary />
          <TaskOverview />
        </div>
        <div className="lg:col-span-1 flex">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
