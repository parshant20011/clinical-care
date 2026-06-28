import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { residents } from "@/data/mockData";

export default function Residents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "permanent" | "respite" | "on-leave">("all");

  const filtered = residents.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.room.includes(search);
    const matchFilter =
      filter === "all" ||
      (filter === "permanent" && r.status === "Permanent") ||
      (filter === "respite" && r.status === "Respite") ||
      (filter === "on-leave" && r.onLeave);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Residents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {residents.length} residents total
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Resident
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "permanent", "respite", "on-leave"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f.replace("-", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium">Resident</TableHead>
              <TableHead className="font-medium">Room</TableHead>
              <TableHead className="font-medium">DOA</TableHead>
              <TableHead className="font-medium">Respite</TableHead>
              <TableHead className="font-medium">On Leave</TableHead>
              <TableHead className="font-medium">ACD/P</TableHead>
              <TableHead className="font-medium">CPR</TableHead>
              <TableHead className="font-medium">BGL</TableHead>
              <TableHead className="font-medium">Mobile</TableHead>
              <TableHead className="font-medium">IHI</TableHead>
              <TableHead className="font-medium">AN-ACC</TableHead>
              <TableHead className="font-medium">Task</TableHead>
              <TableHead className="font-medium">Alert</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow
                key={r.id}
                className="cursor-pointer hover:bg-muted/40"
                onClick={() => navigate(`/residents/${r.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium shrink-0">
                      {r.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.age} yrs · {r.gender}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{r.room}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.doa}</TableCell>
                <TableCell>
                  {r.respite ? (
                    <Badge variant="secondary" className="text-xs">Yes</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">No</span>
                  )}
                </TableCell>
                <TableCell>
                  {r.onLeave ? (
                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">Leave</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {r.acdp ? (
                    <span className="text-xs font-medium text-blue-600">ACD</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {r.cpr ? (
                    <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">FOR</Badge>
                  ) : (
                    <Badge className="text-xs bg-red-100 text-red-700 hover:bg-red-100">NOT</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {r.bgl ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {r.mobile ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{r.ihi.slice(-6)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{r.anAcc}</Badge>
                </TableCell>
                <TableCell>
                  {r.task > 0 ? (
                    <Badge className="text-xs">{r.task}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {r.alert ? (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No residents match your search.
          </div>
        )}
      </div>
    </div>
  );
}
