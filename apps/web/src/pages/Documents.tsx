import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Search, Upload, FileText } from "lucide-react";
import { facilityDocuments as initialDocuments, type FacilityDocument } from "@/data/mockData";
import DocumentDetailDialog from "@/components/documents/DocumentDetailDialog";

const categories = [...new Set(initialDocuments.map((d) => d.category))];
const types: FacilityDocument["type"][] = ["PDF", "Word", "Excel", "Image"];

const emptyForm = { name: "", category: categories[0], type: "PDF" as FacilityDocument["type"] };

export default function Documents() {
  const [documents, setDocuments] = useState<FacilityDocument[]>(initialDocuments);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState<FacilityDocument | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = documents.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || d.category === category;
    const matchType = type === "all" || d.type === type;
    return matchSearch && matchCategory && matchType;
  });

  function handleUpload() {
    if (!form.name) return;
    const newDoc: FacilityDocument = {
      id: `d${Date.now()}`,
      name: form.name,
      category: form.category,
      type: form.type,
      size: "—",
      uploadDate: new Date().toISOString().slice(0, 10),
      uploadedBy: "Admin",
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setForm(emptyForm);
    setUploadOpen(false);
  }

  function handleDelete(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setSelected(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setUploadOpen(true)} className="w-full sm:w-auto">
          <Upload className="h-4 w-4 mr-1" />
          Upload Document
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} documents
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <Card
            key={doc.id}
            className="cursor-pointer hover:bg-muted/40 transition-colors"
            onClick={() => setSelected(doc)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                <FileText className={doc.type === "Word" ? "h-5 w-5 text-blue-600" : "h-5 w-5 text-red-600"} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{doc.category}</Badge>
                  <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {doc.size} · {doc.uploadDate}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground text-center py-8">
            No documents match your search.
          </p>
        )}
      </div>

      <DocumentDetailDialog
        doc={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onDelete={handleDelete}
      />

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Document Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as FacilityDocument["type"] })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
