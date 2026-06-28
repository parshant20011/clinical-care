import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { carePlans, carePlanTypes } from "@/data/mockData";

interface CarePlanTabProps {
  residentId: string;
}

export default function CarePlanTab({ residentId }: CarePlanTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const plans = carePlans.filter((p) => p.residentId === residentId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {plans.length} care plan{plans.length !== 1 ? "s" : ""} active
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Care Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Available Care Plan Types</p>
          <div className="grid grid-cols-2 gap-1">
            {carePlanTypes.map((type) => (
              <div
                key={type}
                className="text-sm text-muted-foreground py-1 px-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader
                className="pb-2 cursor-pointer"
                onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium">{plan.type}</CardTitle>
                    <Badge variant={plan.status === "active" ? "default" : "secondary"} className="text-xs">
                      {plan.status}
                    </Badge>
                  </div>
                  {expanded === plan.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Review: {plan.reviewDate} · By: {plan.createdBy}
                </p>
              </CardHeader>
              {expanded === plan.id && (
                <CardContent className="pt-0 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Observations</p>
                    <p className="text-sm">{plan.observations}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Goals</p>
                    <p className="text-sm">{plan.goals}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Interventions</p>
                    <p className="text-sm">{plan.interventions}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
