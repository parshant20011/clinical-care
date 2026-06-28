import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Users, FileText } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          System configuration and management
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Facility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Facility Name</Label>
            <Input defaultValue="Amber Aged Care" className="mt-1 max-w-sm" />
          </div>
          <div>
            <Label className="text-sm">Facility Address</Label>
            <Input defaultValue="123 Care Street, Adelaide SA 5000" className="mt-1 max-w-sm" />
          </div>
          <Button size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Manage system users, roles and access permissions.
          </p>
          <Button size="sm" variant="outline">Manage Users</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Form Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Create and manage form, assessment, and checklist templates.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Form Templates</Button>
            <Button size="sm" variant="outline">Assessment Templates</Button>
            <Button size="sm" variant="outline">Checklist Templates</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
