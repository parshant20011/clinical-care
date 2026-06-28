import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { residents } from "@/data/mockData";

export default function ResidentSummary() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">
          Recent Residents
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/residents")}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {residents.slice(0, 5).map((resident) => (
            <div
              key={resident.id}
              className="flex items-center justify-between px-6 py-3 hover:bg-muted/40 cursor-pointer transition-colors"
              onClick={() => navigate(`/residents/${resident.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-medium">
                  {resident.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{resident.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Room {resident.room} · {resident.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {resident.alert && (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
                {resident.task > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {resident.task} task{resident.task > 1 ? "s" : ""}
                  </Badge>
                )}
                {!resident.alert && resident.task === 0 && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
