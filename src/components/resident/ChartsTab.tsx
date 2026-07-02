import { useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Activity, Droplet, Heart, Plus } from "lucide-react";
import { vitalReadings, weightReadings, chartBglReadings, behaviorReadings } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const chartCategories = [
  { key: "vitals", label: "Vital Signs", icon: Activity },
  { key: "weight", label: "Weight", icon: Droplet },
  { key: "bgl", label: "Blood Glucose", icon: Droplet },
  { key: "behavior", label: "Behavior", icon: Heart },
] as const;

type ChartKey = (typeof chartCategories)[number]["key"];

interface ChartsTabProps {
  residentId: string;
}

export default function ChartsTab({ residentId }: ChartsTabProps) {
  const [active, setActive] = useState<ChartKey>("vitals");

  const vitals = vitalReadings.filter((v) => v.residentId === residentId);
  const weights = weightReadings.filter((w) => w.residentId === residentId);
  const bgl = chartBglReadings.filter((b) => b.residentId === residentId);
  const behavior = behaviorReadings.filter((b) => b.residentId === residentId);
  const latestVital = vitals.at(-1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Clinical Charts</h3>
        <Button onClick={() => toast({ title: "Entry added", description: "New chart entry recorded." })}>
          <Plus className="h-4 w-4 mr-1" />
          Add Entry
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {chartCategories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
              active === c.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-card text-foreground hover:bg-muted/50"
            )}
          >
            <c.icon className="h-4 w-4" />
            {c.label}
          </button>
        ))}
      </div>

      <div className="border rounded-lg p-4">
        {active === "vitals" && (
          <>
            <p className="text-sm font-semibold mb-3">Blood Pressure &amp; Pulse</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={vitals}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 140]} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pulse" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            {latestVital && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                  <p className="text-sm font-semibold mt-0.5">{latestVital.systolic}/{latestVital.diastolic} mmHg</p>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground">Pulse</p>
                  <p className="text-sm font-semibold mt-0.5">{latestVital.pulse} bpm</p>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="text-sm font-semibold mt-0.5">{latestVital.temperature}°C</p>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground">SpO2</p>
                  <p className="text-sm font-semibold mt-0.5">{latestVital.spo2}%</p>
                </div>
              </div>
            )}
          </>
        )}

        {active === "weight" && (
          <>
            <p className="text-sm font-semibold mb-3">Weight Tracking</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={weights}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} domain={["dataMin - 1", "dataMax + 1"]} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}

        {active === "bgl" && (
          <>
            <p className="text-sm font-semibold mb-3">Blood Glucose Levels</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={bgl}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 12]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        {active === "behavior" && (
          <>
            <p className="text-sm font-semibold mb-3">Behaviour Incidents</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={behavior}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="incidents" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}
