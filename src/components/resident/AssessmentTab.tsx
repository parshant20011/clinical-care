import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Calendar, User } from "lucide-react";
import { assessmentRecords, assessmentTypeOptions } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface AssessmentTabProps {
  residentId: string;
}

export default function AssessmentTab({ residentId }: AssessmentTabProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [assessor, setAssessor] = useState("");
  const [notes, setNotes] = useState("");

  const records = assessmentRecords.filter((a) => a.residentId === residentId);

  const handleSchedule = () => {
    if (!type) return;
    toast({ title: "Assessment Scheduled", description: `${type} has been scheduled.` });
    setType("");
    setAssessor("");
    setNotes("");
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Assessments</h3>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Assessment
        </Button>
      </div>

      <div className="space-y-3">
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No assessments recorded yet.
          </p>
        ) : (
          records.map((a) => (
            <div key={a.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{a.name}</p>
                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-transparent">
                  {a.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {a.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {a.by}
                </span>
                <span>Score: {a.score}</span>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">{a.summary}</p>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Assessment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Assessment Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTypeOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Assessor</Label>
              <Input
                placeholder="Enter assessor name"
                value={assessor}
                onChange={(e) => setAssessor(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Notes</Label>
              <Textarea
                placeholder="Add notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1.5"
              />
            </div>
            <Button className="w-full" onClick={handleSchedule}>
              Schedule Assessment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
