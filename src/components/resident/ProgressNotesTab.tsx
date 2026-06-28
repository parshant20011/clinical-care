import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { progressNotes } from "@/data/mockData";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  clinical: "bg-blue-100 text-blue-700",
  "personal care": "bg-green-100 text-green-700",
  behaviour: "bg-orange-100 text-orange-700",
  incident: "bg-red-100 text-red-700",
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
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200">
          <CardContent className="p-4 space-y-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48">
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
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSubmit}>Save Note</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No progress notes recorded yet.
          </p>
        ) : (
          notes.map((n) => (
            <Card key={n.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                      categoryColors[n.category]
                    )}
                  >
                    {n.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {n.date} {n.time}
                  </span>
                </div>
                <p className="text-sm">{n.note}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Recorded by: {n.author}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
