import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { progressNotes } from "@/data/mockData";
import { cn } from "@/lib/utils";

const categoryColors = {
  clinical: "bg-blue-100 text-blue-700",
  "personal care": "bg-green-100 text-green-700",
  behaviour: "bg-orange-100 text-orange-700",
  incident: "bg-red-100 text-red-700",
};

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Recent Progress Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {progressNotes.map((note) => (
            <div key={note.id} className="px-6 py-3">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                    categoryColors[note.category]
                  )}
                >
                  {note.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {note.date} {note.time}
                </span>
              </div>
              <p className="text-sm line-clamp-2">{note.note}</p>
              <p className="text-xs text-muted-foreground mt-1">
                By {note.author}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
