import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { User, Shield, Bell, Palette, Pencil, Trash2, Plus } from "lucide-react";
import { staffUsers as initialStaff, type StaffUser } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const emptyStaff = { name: "", email: "", role: "Carer", shift: "Morning" as StaffUser["shift"] };

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "s.johnson@care.com",
    phone: "0411 111 111",
    role: "Registered Nurse",
    shift: "Morning",
  });
  const [staff, setStaff] = useState<StaffUser[]>(initialStaff);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newStaff, setNewStaff] = useState(emptyStaff);
  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    urgentAlerts: true,
    assessmentReminders: true,
    medicationAlerts: false,
    woundCareUpdates: false,
    emailNotifications: false,
  });
  const [preferences, setPreferences] = useState({
    language: "en-AU",
    timezone: "Australia/Sydney",
    dateFormat: "DD/MM/YYYY",
    compactView: false,
    autoRefresh: true,
  });

  function handleAddStaff() {
    if (!newStaff.name || !newStaff.email) return;
    setStaff((prev) => [...prev, { id: `u${Date.now()}`, ...newStaff }]);
    setNewStaff(emptyStaff);
    setAddUserOpen(false);
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <Tabs defaultValue="profile">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-slate-100 p-1">
          <TabsTrigger value="profile" className="gap-2 px-4 py-2 data-[state=active]:shadow-sm">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2 px-4 py-2 data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4" /> Role Management
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 px-4 py-2 data-[state=active]:shadow-sm">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2 px-4 py-2 data-[state=active]:shadow-sm">
            <Palette className="h-4 w-4" /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold">User Profile</h3>
              <div className="flex flex-wrap items-start gap-6">
                <div className="space-y-2">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" variant="outline" onClick={() => toast({ title: "Change Photo", description: "Photo upload coming soon." })}>
                    Change Photo
                  </Button>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-64">
                  <div>
                    <Label className="text-sm">First Name</Label>
                    <Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Last Name</Label>
                    <Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Email</Label>
                    <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Phone</Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Role</Label>
                    <Input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Shift</Label>
                    <Select value={profile.shift} onValueChange={(v) => setProfile({ ...profile, shift: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => toast({ title: "Profile saved" })}>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold">Change Password</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                <div className="sm:col-span-2">
                  <Label className="text-sm">Current Password</Label>
                  <Input type="password" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">New Password</Label>
                  <Input type="password" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Confirm New Password</Label>
                  <Input type="password" className="mt-1" />
                </div>
              </div>
              <Button onClick={() => toast({ title: "Password updated" })}>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Staff & Roles</h3>
                <Button size="sm" onClick={() => setAddUserOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add User
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium">
                            {s.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-sm font-medium">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{s.email}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{s.role}</Badge></TableCell>
                      <TableCell className="text-sm">{s.shift}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => toast({ title: `Editing ${s.name}` })}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setStaff((prev) => prev.filter((u) => u.id !== s.id))}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6 space-y-1">
              <h3 className="text-base font-semibold mb-3">Notification Preferences</h3>
              {[
                { key: "taskAssignments" as const, label: "Task Assignments", desc: "Get notified when a task is assigned to you" },
                { key: "urgentAlerts" as const, label: "Urgent Alerts", desc: "Receive alerts for urgent clinical events" },
                { key: "assessmentReminders" as const, label: "Assessment Reminders", desc: "Reminders for upcoming assessments" },
                { key: "medicationAlerts" as const, label: "Medication Alerts", desc: "Notifications for medication schedules" },
                { key: "woundCareUpdates" as const, label: "Wound Care Updates", desc: "Updates on wound treatment progress" },
                { key: "emailNotifications" as const, label: "Email Notifications", desc: "Receive notifications via email" },
              ].map((item, i, arr) => (
                <div key={item.key} className={i < arr.length - 1 ? "flex items-center justify-between py-3 border-b" : "flex items-center justify-between py-3"}>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold">System Preferences</h3>
              <div>
                <Label className="text-sm">Language</Label>
                <Select value={preferences.language} onValueChange={(v) => setPreferences({ ...preferences, language: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-AU">English (Australia)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Time Zone</Label>
                <Select value={preferences.timezone} onValueChange={(v) => setPreferences({ ...preferences, timezone: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Australia/Sydney">Australia/Sydney (AEST)</SelectItem>
                    <SelectItem value="Australia/Perth">Australia/Perth (AWST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Date Format</Label>
                <Select value={preferences.dateFormat} onValueChange={(v) => setPreferences({ ...preferences, dateFormat: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between py-3 border-t">
                <div>
                  <p className="text-sm font-medium">Compact View</p>
                  <p className="text-xs text-muted-foreground">Show more items in lists</p>
                </div>
                <Switch
                  checked={preferences.compactView}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, compactView: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-t">
                <div>
                  <p className="text-sm font-medium">Auto-refresh</p>
                  <p className="text-xs text-muted-foreground">Automatically refresh data every 5 minutes</p>
                </div>
                <Switch
                  checked={preferences.autoRefresh}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, autoRefresh: checked })}
                />
              </div>
              <Button onClick={() => toast({ title: "Preferences saved" })}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Role</Label>
                <Input value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Shift</Label>
                <Select value={newStaff.shift} onValueChange={(v) => setNewStaff({ ...newStaff, shift: v as StaffUser["shift"] })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStaff}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
