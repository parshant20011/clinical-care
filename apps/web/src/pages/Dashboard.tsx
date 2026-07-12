import { Users, ClipboardList, FileSearch, BedDouble, HeartPulse, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import ResidentSummary from "@/components/dashboard/ResidentSummary";
import TaskOverview from "@/components/dashboard/TaskOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useDashboardStats } from "@/services/tasks";

export default function Dashboard() {
  // The six headline numbers are computed server-side (count queries) rather
  // than shipping every row to the browser to be counted here.
  const { data: stats } = useDashboardStats();
  const s = stats ?? {
    totalResidents: 0,
    activeTasks: 0,
    pendingAssessments: 0,
    activeWounds: 0,
    highCare: 0,
    urgentTasks: 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard title="Total Residents" value={s.totalResidents} icon={Users} iconColor="text-blue-600" tint="blue" />
        <StatsCard title="Active Tasks" value={s.activeTasks} icon={ClipboardList} iconColor="text-blue-600" />
        <StatsCard title="Pending Assessments" value={s.pendingAssessments} icon={FileSearch} iconColor="text-blue-600" />
        <StatsCard title="Active Wounds" value={s.activeWounds} icon={BedDouble} iconColor="text-red-600" tint="red" />
        <StatsCard title="High Care" value={s.highCare} icon={HeartPulse} iconColor="text-orange-600" />
        <StatsCard title="Urgent Tasks" value={s.urgentTasks} icon={AlertTriangle} iconColor="text-red-600" />
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
