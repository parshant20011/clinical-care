import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, FileText, Plus } from "lucide-react";
import { forms } from "@/data/mockData";

export default function FormsTab() {
  const [search, setSearch] = useState("");

  const filtered = forms.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="border rounded-lg divide-y">
        <div className="px-4 py-2 flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors">
          <Plus className="h-4 w-4" />
          Create new form
        </div>
        {filtered.map((form) => (
          <div
            key={form}
            className="px-4 py-2.5 flex items-center gap-2 text-sm hover:bg-muted/40 cursor-pointer transition-colors"
          >
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            {form}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">
            No forms match your search.
          </p>
        )}
      </div>
    </div>
  );
}
