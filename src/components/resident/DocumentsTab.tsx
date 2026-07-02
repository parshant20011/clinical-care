import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, FileText, Eye, Download } from "lucide-react";
import { residentDocuments } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface DocumentsTabProps {
  residentId: string;
}

export default function DocumentsTab({ residentId }: DocumentsTabProps) {
  const [search, setSearch] = useState("");

  const docs = residentDocuments
    .filter((d) => d.residentId === residentId)
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Documents</h3>
        <Button onClick={() => toast({ title: "Upload started", description: "Select a file to upload." })}>
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
            <div key={doc.id} className="border rounded-lg p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {doc.category} · {doc.size} · Uploaded {doc.uploadDate}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
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
