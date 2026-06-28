import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const classifications = [
  "1A – Complex Health Care", "1B – Complex Health Care", "2A – Complex Health Care",
  "3A – Dementia Care", "3B – Dementia Care", "4A – Physical Care",
  "4B – Physical Care", "4C – Physical Care", "5A – Physical Care",
];

const history = [
  { classification: "A1", effectDate: "2026-01-01", endDate: "—", prediction: "No", comment: "Annual review" },
  { classification: "A2", effectDate: "2025-07-01", endDate: "2025-12-31", prediction: "No", comment: "Mid-year review" },
];

interface ANACCTabProps {
  resident?: { anAcc: string; ihi: string };
}

export default function ANACCTab(_props: ANACCTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">AN-ACC Assessment</CardTitle>
            <p className="text-xs text-muted-foreground">My Aged Care ID / AN-ACC ID:</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" />
              Tick if this is a prediction
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Effective date</Label>
                <Input type="date" defaultValue="2026-06-24" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Classification</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose AN-ACC" />
                  </SelectTrigger>
                  <SelectContent>
                    {classifications.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Comment</Label>
              <Textarea placeholder="Add comment..." rows={3} className="mt-1" />
            </div>
            <Button size="sm">Submit</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Enteral / Oxygen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">From date</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">To date</Label>
                <Input type="date" className="mt-1" />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="type" value="enteral" />
                Enteral
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="type" value="oxygen" />
                Oxygen
              </label>
            </div>
            <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">
              Drag and drop a file here or click
            </div>
            <Button size="sm">Submit</Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Classification History</h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-medium">Classification</TableHead>
                <TableHead className="text-xs font-medium">Effect Date</TableHead>
                <TableHead className="text-xs font-medium">End Date</TableHead>
                <TableHead className="text-xs font-medium">Prediction</TableHead>
                <TableHead className="text-xs font-medium">Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{h.classification}</TableCell>
                  <TableCell className="text-sm">{h.effectDate}</TableCell>
                  <TableCell className="text-sm">{h.endDate}</TableCell>
                  <TableCell className="text-sm">{h.prediction}</TableCell>
                  <TableCell className="text-sm">{h.comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
