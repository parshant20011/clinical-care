import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, User, Pencil } from "lucide-react";
import { progressNotes } from "@/data/mockData";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  clinical: "bg-blue-50 text-blue-600 border-transparent",
  "personal care": "bg-green-50 text-green-600 border-transparent",
  behaviour: "bg-orange-50 text-orange-600 border-transparent",
  incident: "bg-red-50 text-red-600 border-transparent",
};

interface ProgressNotesTabProps {
  residentId: string;
}

export default function ProgressNotesTab({ residentId }: ProgressNotesTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<string>("");

  const notes = progressNotes.filter((n) => n.residentId === residentId);

  const handleSubmit = () => {
    if (!note.trim() || !category) return;
    setNote("");
    setCategory("");
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold">Progress Notes</h3>
        <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 space-y-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clinical">Clinical</SelectItem>
              <SelectItem value="personal care">Personal Care</SelectItem>
              <SelectItem value="behaviour">Behaviour</SelectItem>
              <SelectItem value="incident">Incident</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Enter progress note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" onClick={handleSubmit}>Save Note</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No progress notes recorded yet.
          </p>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Badge variant="outline" className={cn("capitalize", categoryColors[n.category])}>
                    {n.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {n.date}, {n.time}:00
                  </span>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm mt-3">{n.note}</p>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                <User className="h-3 w-3" />
                {n.author}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
