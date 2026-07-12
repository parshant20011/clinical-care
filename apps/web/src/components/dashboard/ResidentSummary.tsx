import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useResidents } from "@/services/residents";
import QueryState from "@/components/QueryState";
import { cn } from "@/lib/utils";

const careLevelDot = {
  Low: "bg-green-500",
  Medium: "bg-orange-500",
  High: "bg-red-500",
};

export default function ResidentSummary() {
  const navigate = useNavigate();
  const { data: residents = [], isLoading, isError } = useResidents();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-base sm:text-lg font-semibold">Residents Overview</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/residents")}
          className="text-sm text-blue-600 hover:text-blue-700 h-auto p-0"
        >
          View all
        </Button>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          isEmpty={residents.length === 0}
          emptyMessage="No residents yet."
          errorMessage="Couldn't load residents."
        >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {residents.slice(0, 6).map((resident) => (
            <div
              key={resident.id}
              className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => navigate(`/residents/${resident.id}`)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-medium shrink-0">
                  {resident.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{resident.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Room {resident.room}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{resident.age} years</span>
                <div className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", careLevelDot[resident.careLevel])} />
                  <span className="text-xs text-muted-foreground">{resident.careLevel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </QueryState>
      </CardContent>
    </Card>
  );
}
