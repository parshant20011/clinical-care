import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, AlertTriangle, UserPlus, ClipboardList } from "lucide-react";
import { recentActivity, type ActivityItem } from "@/data/mockData";
import { cn } from "@/lib/utils";

const kindConfig: Record<ActivityItem["kind"], { icon: typeof FileText; bg: string; color: string }> = {
  note: { icon: FileText, bg: "bg-blue-50", color: "text-blue-600" },
  task: { icon: Clock, bg: "bg-green-50", color: "text-green-600" },
  alert: { icon: AlertTriangle, bg: "bg-red-50", color: "text-red-600" },
  assessment: { icon: UserPlus, bg: "bg-purple-50", color: "text-purple-600" },
  careplan: { icon: ClipboardList, bg: "bg-blue-50", color: "text-blue-600" },
};

export default function RecentActivity() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-base sm:text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
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
                    {item.author} · {item.timeAgo}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 text-center pt-4 mt-4 border-t border-slate-200">
          View all activity
        </button>
      </CardContent>
    </Card>
  );
}
