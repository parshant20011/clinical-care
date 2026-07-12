import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FileText, DollarSign, Calendar, CalendarClock, Pencil, CheckCircle2 } from "lucide-react";
import { useAnacc } from "@/services/clinical";
import { toast } from "@/hooks/use-toast";
import type { ResidentDetail } from "@clinical/shared";

interface ANACCTabProps {
  resident?: ResidentDetail;
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-AU");

export default function ANACCTab({ resident }: ANACCTabProps) {
  const { data: detail, isLoading } = useAnacc(resident?.id ?? "");

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
    );
  }

  if (!detail) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No AN-ACC assessment recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold">AN-ACC Assessment</h3>
        <Button onClick={() => toast({ title: "Assessment updated" })} className="w-full sm:w-auto">
          <Pencil className="h-4 w-4 mr-1" />
          Update Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-l-4 border-l-blue-600 p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Funding Class
          </p>
          <p className="text-xl font-bold mt-1">{detail.fundingClass}</p>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-transparent text-xs mt-1">
            {detail.fundingLevel}
          </Badge>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" /> Daily Rate
          </p>
          <p className="text-xl font-bold mt-1">{detail.dailyRate}</p>
          <p className="text-xs text-muted-foreground mt-1">Per day subsidy</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Assessment Date
          </p>
          <p className="text-xl font-bold mt-1">{fmt(detail.assessmentDate)}</p>
          <p className="text-xs text-muted-foreground mt-1">Last assessment</p>
        </div>
        <div className="rounded-lg border border-l-4 border-l-green-500 p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" /> Next Review
          </p>
          <p className="text-xl font-bold mt-1">{fmt(detail.nextReview)}</p>
          <p className="text-xs text-muted-foreground mt-1">Scheduled review</p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-sm font-semibold mb-4">Domain Scores</p>
        <div className="space-y-4">
          {detail.domainScores.map((d) => (
            <div key={d.label}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span>{d.label}</span>
                <span className="font-medium">{d.score}/{d.outOf}</span>
              </div>
              <Progress value={(d.score / d.outOf) * 100} />
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <p className="text-sm font-semibold">IHI Verification</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input value={detail.ihiNumber} readOnly className="w-full sm:max-w-sm" />
          {detail.ihiVerified && (
            <span className="flex items-center gap-1 text-sm text-green-600 font-medium whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4" />
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast({ title: "Opening full assessment" })}>
          View Full Assessment
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Report downloaded" })}>
          Download Report
        </Button>
        <Button onClick={() => toast({ title: "Re-assessment requested" })}>
          Request Re-assessment
        </Button>
      </div>
    </div>
  );
}
