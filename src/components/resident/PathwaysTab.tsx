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

const pathways = [
  { name: "Blood Glucose Monitoring", history: "1", reports: "0", reviewCycle: "Monthly", date: "2026-06-01", by: "Jane Smith RN", status: "active" },
  { name: "Blood Pressure Monitoring", history: "2", reports: "0", reviewCycle: "Monthly", date: "2026-06-01", by: "Jane Smith RN", status: "active" },
  { name: "Weight Monitoring", history: "1", reports: "0", reviewCycle: "Weekly", date: "2026-06-01", by: "Jane Smith RN", status: "active" },
];

export default function PathwaysTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Pathway
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
            {pathways.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="font-medium text-sm">{p.name}</TableCell>
                <TableCell>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {p.history}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {p.reports}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.reviewCycle}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.by}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
