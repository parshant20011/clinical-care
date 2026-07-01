import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Trash2 } from "lucide-react";
import type { FacilityDocument } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface DocumentDetailDialogProps {
  doc: FacilityDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
}

export default function DocumentDetailDialog({ doc, open, onOpenChange, onDelete }: DocumentDetailDialogProps) {
  if (!doc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{doc.name}</DialogTitle>
        </DialogHeader>
        <div className="border border-dashed rounded-lg p-8 flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-sm text-muted-foreground">Document preview would be displayed here</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "Preview", description: `Previewing ${doc.name}` })}
            >
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "Download started", description: doc.name })}
            >
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(doc.id)}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Uploaded by</p>
            <p className="text-sm font-medium">{doc.uploadedBy}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Size</p>
            <p className="text-sm font-medium">{doc.size}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Category</p>
            <p className="text-sm font-medium">{doc.category}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm font-medium">{doc.type}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
