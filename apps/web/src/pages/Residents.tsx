import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Plus, ArrowUpDown, Filter } from "lucide-react";
import { residents as initialResidents, type Resident } from "@/data/mockData";
import { cn } from "@/lib/utils";

type SortKey = "name" | "age" | "room" | "careLevel";

const careLevelRank = { Low: 0, Medium: 1, High: 2 };

const emptyForm = { name: "", room: "", age: "", gender: "Female", diagnosis: "" };

export default function Residents() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState<Resident[]>(initialResidents);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [careLevel, setCareLevel] = useState("all");
  const [accountStatus, setAccountStatus] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = residents.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.room.includes(search) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchGender = gender === "all" || r.gender === gender;
    const matchCareLevel = careLevel === "all" || r.careLevel === careLevel;
    const matchStatus = accountStatus === "all" || r.accountStatus === accountStatus;
    return matchSearch && matchGender && matchCareLevel && matchStatus;
  });

  const sorted = sort
    ? [...filtered].sort((a, b) => {
        let cmp = 0;
        if (sort.key === "name") cmp = a.name.localeCompare(b.name);
        else if (sort.key === "age") cmp = a.age - b.age;
        else if (sort.key === "room") cmp = a.room.localeCompare(b.room);
        else if (sort.key === "careLevel") cmp = careLevelRank[a.careLevel] - careLevelRank[b.careLevel];
        return sort.dir === "asc" ? cmp : -cmp;
      })
    : filtered;

  function toggleSort(key: SortKey) {
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  }

  function handleAddResident() {
    if (!form.name || !form.room) return;
    const newResident: Resident = {
      id: `${Date.now()}`,
      name: form.name,
      room: form.room,
      doa: new Date().toISOString().slice(0, 10),
      age: Number(form.age) || 0,
      gender: form.gender,
      status: "Permanent",
      respite: false,
      onLeave: false,
      acdp: false,
      cpr: false,
      bgl: false,
      mobile: false,
      ihi: "",
      anAcc: "—",
      task: 0,
      alert: false,
      doctor: "",
      medicareCard: "",
      concessionNumber: "",
      nok: "",
      residence: "",
      urn: "",
      diagnosis: form.diagnosis,
      allergies: [],
      careLevel: "Low",
      accountStatus: "Active",
    };
    setResidents((prev) => [...prev, newResident]);
    setForm(emptyForm);
    setAddOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, room, or diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Genders" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
          </SelectContent>
        </Select>
        <Select value={careLevel} onValueChange={setCareLevel}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="All Levels" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        <Select value={accountStatus} onValueChange={setAccountStatus}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-1" />
          More Filters
        </Button>
        <Button size="sm" onClick={() => setAddOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" />
          Add Resident
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {sorted.length} of {residents.length} residents
      </p>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {sorted.map((r) => (
          <div
            key={r.id}
            className="border rounded-lg p-4 cursor-pointer hover:bg-muted/40 active:bg-muted/60"
            onClick={() => navigate(`/residents/${r.id}`)}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium shrink-0">
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Room {r.room} · {r.age} years · {r.gender}
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{r.diagnosis.split(",")[0]}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      r.careLevel === "High" && "bg-red-100 text-red-700 hover:bg-red-100",
                      r.careLevel === "Medium" && "bg-orange-100 text-orange-700 hover:bg-orange-100",
                      r.careLevel === "Low" && "bg-green-100 text-green-700 hover:bg-green-100"
                    )}
                  >
                    {r.careLevel}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-xs",
                      r.accountStatus === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-muted text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {r.accountStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No residents match your search.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium cursor-pointer select-none" onClick={() => toggleSort("name")}>
                <span className="inline-flex items-center gap-1">Resident Name <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="font-medium cursor-pointer select-none" onClick={() => toggleSort("age")}>
                <span className="inline-flex items-center gap-1">Age <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="font-medium hidden md:table-cell">Gender</TableHead>
              <TableHead className="font-medium cursor-pointer select-none" onClick={() => toggleSort("room")}>
                <span className="inline-flex items-center gap-1">Room <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="font-medium hidden lg:table-cell">Primary Diagnosis</TableHead>
              <TableHead className="font-medium cursor-pointer select-none" onClick={() => toggleSort("careLevel")}>
                <span className="inline-flex items-center gap-1">Care Level <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => (
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
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground">ID: R{r.id.padStart(3, "0")}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm whitespace-nowrap">{r.age} years</TableCell>
                <TableCell className="text-sm hidden md:table-cell">{r.gender}</TableCell>
                <TableCell className="text-sm whitespace-nowrap">{r.room}</TableCell>
                <TableCell className="text-sm hidden lg:table-cell max-w-[12rem] truncate">{r.diagnosis.split(",")[0]}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "text-xs",
                      r.careLevel === "High" && "bg-red-100 text-red-700 hover:bg-red-100",
                      r.careLevel === "Medium" && "bg-orange-100 text-orange-700 hover:bg-orange-100",
                      r.careLevel === "Low" && "bg-green-100 text-green-700 hover:bg-green-100"
                    )}
                  >
                    {r.careLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "text-xs",
                      r.accountStatus === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-muted text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {r.accountStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {sorted.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No residents match your search.
          </div>
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Resident</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Room</Label>
                <Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Age</Label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Primary Diagnosis</Label>
              <Input value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddResident}>Add Resident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
