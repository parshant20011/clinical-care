import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Search, FileText, Plus, ExternalLink } from "lucide-react";
import { clinicalForms, type ClinicalForm } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

export default function FormsTab() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ClinicalForm | null>(null);

  const filtered = clinicalForms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Clinical Forms</h3>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Create New Form
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((form) => (
          <button
            key={form.id}
            onClick={() => setSelected(form)}
            className="border rounded-lg p-4 flex items-start gap-3 text-left hover:bg-muted/40 transition-colors"
          >
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug">{form.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-transparent text-xs">
                  {form.category}
                </Badge>
                <span className="text-xs text-muted-foreground">Updated {form.updatedDate}</span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-6 text-sm text-muted-foreground text-center">
            No forms match your search.
          </p>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-3 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Form content would be displayed here</p>
            <p className="text-xs text-muted-foreground">Category: {selected?.category}</p>
            <Button
              onClick={() => {
                toast({ title: "Form opened", description: `${selected?.name} is ready to complete.` });
                setSelected(null);
              }}
            >
              Fill Out Form
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
