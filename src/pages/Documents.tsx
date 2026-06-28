import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload, FileText } from "lucide-react";
import { documentCategories } from "@/data/mockData";

export default function Documents() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Facility-wide document repository
          </p>
        </div>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-1" />
          Upload Document
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search documents..." className="pl-9" />
      </div>

      <div className="border rounded-lg divide-y">
        {documentCategories.map((cat) => (
          <div key={cat} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 cursor-pointer transition-colors">
            <FileText className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="text-sm font-medium text-blue-600">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
