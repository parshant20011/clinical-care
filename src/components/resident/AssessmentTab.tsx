import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const assessments = [
  { name: "Pain Assessment", history: "2", reports: "1", reviewCycle: "Monthly", date: "2026-05-15", by: "Jane Smith RN" },
  { name: "Falls Risk Assessment", history: "3", reports: "2", reviewCycle: "Monthly", date: "2026-06-01", by: "Jane Smith RN" },
  { name: "Nutrition Assessment", history: "1", reports: "0", reviewCycle: "Quarterly", date: "2026-03-10", by: "Sarah Jones EN" },
  { name: "Skin Integrity Assessment", history: "2", reports: "1", reviewCycle: "Monthly", date: "2026-05-20", by: "Jane Smith RN" },
  { name: "Cognitive Assessment", history: "1", reports: "0", reviewCycle: "6 Monthly", date: "2026-01-15", by: "Dr. Smith" },
  { name: "Behaviour Assessment", history: "2", reports: "1", reviewCycle: "Quarterly", date: "2026-04-05", by: "Jane Smith RN" },
];

export default function AssessmentTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Assessment
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium">Assessment</TableHead>
              <TableHead className="font-medium">History</TableHead>
              <TableHead className="font-medium">Reports</TableHead>
              <TableHead className="font-medium">Rev. Cycle</TableHead>
              <TableHead className="font-medium">Date / Actions</TableHead>
              <TableHead className="font-medium">By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((a) => (
              <TableRow key={a.name}>
                <TableCell className="font-medium text-sm">{a.name}</TableCell>
                <TableCell>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {a.history}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {a.reports}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.reviewCycle}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.date}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.by}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
