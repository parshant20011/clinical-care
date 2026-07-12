import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, FileText, Eye, Download } from "lucide-react";
import { useResidentDocuments } from "@/services/clinical";
import { toast } from "@/hooks/use-toast";

interface DocumentsTabProps {
  residentId: string;
}

export default function DocumentsTab({ residentId }: DocumentsTabProps) {
  const [search, setSearch] = useState("");

  const { data: allDocs = [] } = useResidentDocuments(residentId);
  const docs = allDocs.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold">Documents</h3>
        <Button onClick={() => toast({ title: "Upload started", description: "Select a file to upload." })} className="w-full sm:w-auto">
          <Upload className="h-4 w-4 mr-1" />
          Upload Document
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {docs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No documents found.
          </p>
        ) : (
          docs.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {doc.category} · {doc.size} · Uploaded{" "}
                  {new Date(doc.uploadDate).toLocaleDateString("en-AU")}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                <button
                  className="p-2 text-muted-foreground hover:text-foreground"
                  onClick={() => toast({ title: "Preview", description: `Previewing ${doc.name}` })}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-muted-foreground hover:text-foreground"
                  onClick={() => toast({ title: "Download started", description: doc.name })}
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
