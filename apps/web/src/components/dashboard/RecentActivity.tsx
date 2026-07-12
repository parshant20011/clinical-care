import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, AlertTriangle, UserPlus, ClipboardList } from "lucide-react";
import type { ActivityItemDTO } from "@clinical/shared";
import { useRecentActivity } from "@/services/tasks";
import QueryState from "@/components/QueryState";
import { cn } from "@/lib/utils";

const kindConfig: Record<ActivityItemDTO["kind"], { icon: typeof FileText; bg: string; color: string }> = {
  note: { icon: FileText, bg: "bg-blue-50", color: "text-blue-600" },
  task: { icon: Clock, bg: "bg-green-50", color: "text-green-600" },
  alert: { icon: AlertTriangle, bg: "bg-red-50", color: "text-red-600" },
  assessment: { icon: UserPlus, bg: "bg-purple-50", color: "text-purple-600" },
  careplan: { icon: ClipboardList, bg: "bg-blue-50", color: "text-blue-600" },
};

// "5 minutes ago" style relative time from an ISO timestamp.
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function RecentActivity() {
  const { data: recentActivity = [], isLoading, isError } = useRecentActivity();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-base sm:text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          isEmpty={recentActivity.length === 0}
          emptyMessage="No recent activity."
          errorMessage="Couldn't load activity."
        >
        <div className="space-y-5 flex-1">
          {recentActivity.map((item) => {
            const config = kindConfig[item.kind];
            const Icon = config.icon;
            return (
              <div key={item.id} className="flex gap-3">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-snug">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.author} · {timeAgo(item.at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </QueryState>
        <button className="text-sm text-blue-600 hover:text-blue-700 text-center pt-4 mt-4 border-t border-slate-200">
          View all activity
        </button>
      </CardContent>
    </Card>
  );
}
