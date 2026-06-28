import { Card, CardContent } from "@/components/ui/card";
import {
  Activity, Weight, Droplets, Heart, Bandage, FileText, Settings
} from "lucide-react";

const chartButtons = [
  { label: "Care Direct", icon: Activity },
  { label: "Care Direct Schedule", icon: Activity },
  { label: "Care Direct Report", icon: FileText },
  { label: "Nurse Chart", icon: Activity },
  { label: "Nurse Chart Schedule", icon: Activity },
  { label: "Weight Chart", icon: Weight },
  { label: "BGL Chart", icon: Droplets },
  { label: "Vital Chart", icon: Heart },
  { label: "Wound Chart", icon: Bandage },
  { label: "Behaviour Chart lIz", icon: Activity },
  { label: "Resident Reports", icon: FileText },
  { label: "Additional Config", icon: Settings },
];

export default function ChartsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {chartButtons.map((btn) => (
          <button
            key={btn.label}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center cursor-pointer"
          >
            <btn.icon className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-medium leading-tight">{btn.label}</span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" />
              Monitoring BGL
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" />
              NOT to be weighed
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" />
              Nil by Mouth
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
