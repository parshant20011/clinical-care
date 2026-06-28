import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Camera } from "lucide-react";
import { wounds } from "@/data/mockData";

interface WoundsTabProps {
  residentId: string;
}

export default function WoundsTab({ residentId }: WoundsTabProps) {
  const residentWounds = wounds.filter((w) => w.residentId === residentId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button size="sm" variant="outline">All Wounds</Button>
          <Button size="sm" variant="ghost">Wound Summary</Button>
          <Button size="sm" variant="ghost">Healed</Button>
          <Button size="sm" variant="ghost">Archived</Button>
          <Button size="sm" variant="ghost">Monthly Report</Button>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Wound
        </Button>
      </div>

      {residentWounds.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No active wounds recorded.
        </p>
      ) : (
        <div className="space-y-3">
          {residentWounds.map((wound) => (
            <Card key={wound.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{wound.woundType}</CardTitle>
                  <Badge
                    variant={wound.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {wound.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{wound.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Started</p>
                    <p>{wound.startedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">On Admission</p>
                    <p>{wound.onAdmission ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Dressing Product</p>
                    <p>{wound.dressingProduct}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Next Dressing</p>
                    <p>{wound.nextDressing}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Next Review</p>
                    <p>{wound.nextReview}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Camera className="h-4 w-4 mr-1" />
                    Upload Photo
                  </Button>
                  {wound.lastPhoto && (
                    <p className="text-xs text-muted-foreground">
                      Last photo: {wound.lastPhoto}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
