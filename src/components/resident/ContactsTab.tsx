import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Phone, Mail, Star } from "lucide-react";
import type { Resident } from "@/data/mockData";

interface ContactsTabProps {
  resident: Resident;
}

export default function ContactsTab({ resident }: ContactsTabProps) {
  const contacts = [
    { name: resident.nok, relationship: "Next of Kin / Power of Attorney", phone: "(04) 0000 0001", email: "nok@email.com", primary: true },
    { name: "James Thompson", relationship: "Son", phone: "(04) 0000 0002", email: "james@email.com", primary: false },
    { name: "Community Pharmacy", relationship: "Pharmacy", phone: "(08) 8200 2222", email: "pharmacy@local.com.au", primary: false },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Contact
        </Button>
      </div>
      <div className="space-y-3">
        {contacts.map((contact, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{contact.name}</p>
                    {contact.primary && (
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{contact.relationship}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
