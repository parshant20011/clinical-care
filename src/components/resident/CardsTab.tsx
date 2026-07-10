import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { residentCards, anaccDetails, type Resident } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CardsTabProps {
  resident: Resident;
}

const statusStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-600 border-transparent",
  Verified: "bg-green-50 text-green-600 border-transparent",
  Pending: "bg-orange-50 text-orange-600 border-transparent",
  "N/A": "bg-muted text-muted-foreground border-transparent",
};

export default function CardsTab({ resident }: CardsTabProps) {
  const cards = residentCards.filter((c) => c.residentId === resident.id);
  const anacc = anaccDetails.find((a) => a.residentId === resident.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold">Cards &amp; Verification</h3>
        <Button
          variant="outline"
          onClick={() => toast({ title: "Verifying all cards…" })}
          className="w-full sm:w-auto"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Verify All
        </Button>
      </div>

      {cards.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No cards on file.
        </p>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => {
          const verified = card.status === "Active" || card.status === "Verified";
          return (
            <div key={card.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold">{card.type}</p>
                </div>
                {verified ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
              </div>
              <p className="text-sm mt-2">{card.number}</p>
              <div className="flex items-center justify-between mt-2">
                {card.detail ? (
                  <span className="text-xs text-muted-foreground">{card.detail}</span>
                ) : (
                  <span />
                )}
                <Badge variant="outline" className={cn(statusStyles[card.status])}>
                  {card.status}
                </Badge>
              </div>
              {card.status === "Pending" && (
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => toast({ title: "Verification started", description: card.type })}
                >
                  Verify Now
                </Button>
              )}
            </div>
          );
        })}
      </div>
      )}

      {anacc && (
        <div className="border rounded-lg p-4">
          <p className="text-sm font-semibold mb-3">IHI Verification Status</p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              {anacc.ihiVerified ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium">IHI Number: {anacc.ihiNumber}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {anacc.ihiVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
            <Button onClick={() => toast({ title: "Re-verifying IHI…" })}>
              Re-verify
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
