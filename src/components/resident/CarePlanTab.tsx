import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PersonStanding, Pill, Bandage, Droplets, Utensils, Smile, Dumbbell,
  Plus, ChevronRight, ChevronDown,
} from "lucide-react";
import { carePlans, carePlanCategories } from "@/data/mockData";

const categoryIcons: Record<string, typeof Pill> = {
  "fall-risk": PersonStanding,
  medication: Pill,
  "pain-management": Bandage,
  "skin-care": Droplets,
  nutrition: Utensils,
  wellbeing: Smile,
  physiotherapy: Dumbbell,
};

interface CarePlanTabProps {
  residentId: string;
}

export default function CarePlanTab({ residentId }: CarePlanTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const plans = carePlans.filter((p) => p.residentId === residentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Care Plans</h3>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          New Care Plan
        </Button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {carePlanCategories.map((cat) => {
          const Icon = categoryIcons[cat.slug];
          return (
            <div
              key={cat.slug}
              className="border rounded-lg p-3 flex flex-col items-center gap-2 bg-blue-50/50 text-center"
            >
              <Icon className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium leading-tight">{cat.label}</span>
            </div>
          );
        })}
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No care plans recorded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => {
            const isOpen = expanded === plan.id;
            return (
              <div key={plan.id} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : plan.id)}
                >
                  <div>
                    <p className="text-sm font-medium">{plan.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">Review: {plan.reviewDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-transparent">
                      {plan.status === "active" ? "Active" : "Archived"}
                    </Badge>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 border-t space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1 mt-3">Observations</p>
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
