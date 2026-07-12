import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, Mail, Star } from "lucide-react";
import { residentContacts } from "@/data/mockData";
import type { ResidentDetail } from "@clinical/shared";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ContactsTabProps {
  resident: ResidentDetail;
}

export default function ContactsTab({ resident }: ContactsTabProps) {
  const contacts = residentContacts.filter((c) => c.residentId === resident.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold">Contacts</h3>
        <Button onClick={() => toast({ title: "Add Contact", description: "Contact form coming soon." })} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" />
          Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={cn("border rounded-lg p-4", contact.primary && "ring-1 ring-blue-500")}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                {contact.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{contact.name}</p>
                  {contact.primary && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-transparent text-xs">
                      <Star className="h-3 w-3 mr-1 fill-blue-600" />
                      Primary
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{contact.relationship}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3 w-3" />
                    {contact.phone}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    {contact.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="col-span-2 text-sm text-muted-foreground text-center py-8">No contacts found.</p>
        )}
      </div>
    </div>
  );
}
