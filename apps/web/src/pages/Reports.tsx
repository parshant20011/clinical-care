import { useState } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from "recharts";
import { useResidents } from "@/services/residents";
import { useTasks, useDashboardStats } from "@/services/tasks";
import StatsCard from "@/components/dashboard/StatsCard";
import { toast } from "@/hooks/use-toast";
import { Users, ClipboardList, BedDouble, FileSearch } from "lucide-react";

const careLevelColors = { Low: "#22c55e", Medium: "#f97316", High: "#ef4444" };
const statusColors = { pending: "#f97316", in_progress: "#22c55e", completed: "#22c55e", overdue: "#ef4444" };

const reportSections = [
  {
    category: "End of Month",
    reports: [{ id: 1, name: "Cultural representation data" }],
  },
  {
    category: "Governance",
    reports: [
      { id: 2, name: "Occupancy Report" },
      { id: 3, name: "Power BI Reports" },
    ],
  },
  {
    category: "Clinical Reports",
    reports: [
      { id: 4, name: "Clinical Dashboard" },
      { id: 5, name: "Wound Summary" },
      { id: 6, name: "Care Direct Reports" },
      { id: 7, name: "Wellbeing Reports" },
      { id: 8, name: "Last 72 Hours" },
      { id: 9, name: "Weekly Progress Note Check" },
      { id: 10, name: "Unplanned Weight Loss" },
      { id: 11, name: "AN-ACC Matrix" },
    ],
  },
  {
    category: "CRM",
    reports: [{ id: 12, name: "CRM Reports" }],
  },
  {
    category: "Medication Reports",
    reports: [
      { id: 13, name: "Missed Medications" },
      { id: 14, name: "Psychotropic Health Check" },
    ],
  },
];

export default function Reports() {
  const [range, setRange] = useState("this-week");
  const [reportType, setReportType] = useState("all");

  const { data: residents = [] } = useResidents();
  const { data: tasks = [] } = useTasks();
  const { data: stats } = useDashboardStats();

  const careLevelData = (["Low", "Medium", "High"] as const).map((level) => ({
    name: level,
    value: residents.filter((r) => r.careLevel === level).length,
  }));

  const statusData = (["pending", "in_progress", "completed", "overdue"] as const).map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count: tasks.filter((t) => t.status === status).length,
    fill: statusColors[status],
  }));

  // Weekly activity, derived from real task due-dates (the old mock array had no
  // DB backing). Buckets this week's tasks by weekday.
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyActivity = DAYS.map((day) => ({ day, tasks: 0, notes: 0, wounds: 0 }));
  for (const t of tasks) {
    if (!t.dueDate) continue;
    const jsDay = new Date(t.dueDate).getDay(); // 0=Sun
    const idx = jsDay === 0 ? 6 : jsDay - 1; // shift so Mon=0
    weeklyActivity[idx].tasks += 1;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="clinical">Clinical</SelectItem>
              <SelectItem value="governance">Governance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => toast({ title: "Export started", description: "Generating PDF export…" })}
          >
            <Download className="h-4 w-4 mr-1" /> Export PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => toast({ title: "Export started", description: "Generating Excel export…" })}
          >
            <Download className="h-4 w-4 mr-1" /> Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Active Residents" value={stats?.totalResidents ?? residents.length} icon={Users} iconColor="text-blue-600" />
        <StatsCard title="Pending Tasks" value={tasks.filter((t) => t.status === "pending").length} icon={ClipboardList} iconColor="text-orange-600" />
        <StatsCard title="Active Wounds" value={stats?.activeWounds ?? 0} icon={BedDouble} iconColor="text-red-600" />
        <StatsCard title="Pending Assessments" value={stats?.pendingAssessments ?? 0} icon={FileSearch} iconColor="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-2">Care Level Distribution</p>
            <div className="min-h-[200px]">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={careLevelData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                    {careLevelData.map((entry) => (
                      <Cell key={entry.name} fill={careLevelColors[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-2">Task Status Overview</p>
            <div className="min-h-[200px]">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold mb-2">Weekly Activity Summary</p>
          <div className="min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="notes" name="Progress Notes" stroke="#3b82f6" />
                <Line type="monotone" dataKey="tasks" name="Tasks" stroke="#ef4444" />
                <Line type="monotone" dataKey="wounds" name="Wound Updates" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Quick Reports</h2>
        {reportSections.map((section) => (
          <div key={section.category}>
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
              {section.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.reports.map((report) => (
                <Card
                  key={report.id}
                  className="cursor-pointer hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                  onClick={() => toast({ title: report.name, description: "Report preview coming soon." })}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">#{report.id}</p>
                      <p className="text-sm font-medium">{report.name}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
