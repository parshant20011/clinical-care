import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  tint?: "blue" | "red";
}

const iconBg: Record<string, string> = {
  "text-blue-600": "bg-blue-50",
  "text-green-600": "bg-green-50",
  "text-orange-600": "bg-orange-50",
  "text-red-600": "bg-red-50",
  "text-purple-600": "bg-purple-50",
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
  tint,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        tint === "blue" && "bg-blue-50/50 border-blue-100",
        tint === "red" && "bg-red-50/60 border-red-100"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground leading-snug">{title}</p>
          <div
            className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
              iconBg[iconColor] ?? "bg-blue-50"
            )}
          >
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
        <p className="text-3xl font-bold mt-4">{value}</p>
      </CardContent>
    </Card>
  );
}
