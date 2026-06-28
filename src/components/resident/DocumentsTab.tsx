import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload } from "lucide-react";
import { documentCategories } from "@/data/mockData";

export default function DocumentsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search Documents" className="pl-9" />
        </div>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </Button>
      </div>

      <div className="border rounded-lg divide-y">
        {documentCategories.map((cat) => (
          <div key={cat}>
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => setExpanded(expanded === cat ? null : cat)}
            >
              <span>∧ {cat}</span>
            </button>
            {expanded === cat && (
              <div className="px-4 pb-3">
                <p className="text-sm text-muted-foreground text-center py-4">
                  No documents in this category.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
