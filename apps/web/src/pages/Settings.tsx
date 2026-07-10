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

const tabTriggerClass =
  "gap-1.5 sm:gap-2 rounded-lg border border-transparent bg-slate-100 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm";

const notificationItems = [
  { key: "taskAssignments" as const, label: "Task Assignments", desc: "Get notified when a task is assigned to you" },
  { key: "urgentAlerts" as const, label: "Urgent Alerts", desc: "Receive alerts for urgent clinical events" },
  { key: "assessmentReminders" as const, label: "Assessment Reminders", desc: "Reminders for upcoming assessments" },
  { key: "medicationAlerts" as const, label: "Medication Alerts", desc: "Notifications for medication schedules" },
  { key: "woundCareUpdates" as const, label: "Wound Care Updates", desc: "Updates on wound treatment progress" },
  { key: "emailNotifications" as const, label: "Email Notifications", desc: "Receive notifications via email" },
];

const staffRoles = ["Registered Nurse", "Enrolled Nurse", "Carer", "Care Manager", "Admin"];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("");
}

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "s.johnson@care.com",
    phone: "0411 111 111",
    role: "Registered Nurse",
    shift: "Morning",
  });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [staff, setStaff] = useState<StaffUser[]>(initialStaff);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<StaffUser | null>(null);
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
    toast({ title: "User added", description: `${newStaff.name} has been added to the team.` });
  }

  function handleEditStaff() {
    if (!editUser || !editUser.name || !editUser.email) return;
    setStaff((prev) => prev.map((u) => (u.id === editUser.id ? editUser : u)));
    setEditUser(null);
    toast({ title: "User updated", description: `${editUser.name}'s details have been saved.` });
  }

  function handleDeleteStaff(id: string, name: string) {
    setStaff((prev) => prev.filter((u) => u.id !== id));
    toast({ title: "User removed", description: `${name} has been removed from the team.` });
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="profile" className={tabTriggerClass}>
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="roles" className={tabTriggerClass}>
            <Shield className="h-4 w-4" /> Role Management
          </TabsTrigger>
          <TabsTrigger value="notifications" className={tabTriggerClass}>
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className={tabTriggerClass}>
            <Palette className="h-4 w-4" /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base font-semibold mb-6">User Profile</h3>
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col items-center sm:items-start gap-3 shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-medium">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-200"
                    onClick={() => toast({ title: "Change Photo", description: "Photo upload coming soon." })}
                  >
                    Change Photo
                  </Button>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">First Name</Label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">Last Name</Label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">Phone</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">Role</Label>
                    <Input value={profile.role} readOnly className="bg-slate-50 text-muted-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">Shift</Label>
                    <Select value={profile.shift} onValueChange={(v) => setProfile({ ...profile, shift: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-100">
                <Button onClick={() => toast({ title: "Profile saved", description: "Your profile changes have been saved." })}>
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-200"
                  onClick={() => {
                    setProfile({
                      firstName: "Sarah",
                      lastName: "Johnson",
                      email: "s.johnson@care.com",
                      phone: "0411 111 111",
                      role: "Registered Nurse",
                      shift: "Morning",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base font-semibold mb-6">Change Password</h3>
              <div className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Current Password</Label>
                  <Input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">New Password</Label>
                  <Input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
              </div>
              <Button
                className="mt-6"
                onClick={() => {
                  if (passwords.new && passwords.new !== passwords.confirm) {
                    toast({ title: "Passwords don't match", variant: "destructive" });
                    return;
                  }
                  setPasswords({ current: "", new: "", confirm: "" });
                  toast({ title: "Password updated", description: "Your password has been changed successfully." });
                }}
              >
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h3 className="text-base font-semibold">Staff & Roles</h3>
                <Button size="sm" onClick={() => setAddUserOpen(true)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-1.5" /> Add User
                </Button>
              </div>
              <div className="rounded-lg border border-slate-200 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-200">
                      <TableHead className="text-muted-foreground font-medium whitespace-nowrap">Name</TableHead>
                      <TableHead className="text-muted-foreground font-medium whitespace-nowrap hidden sm:table-cell">Email</TableHead>
                      <TableHead className="text-muted-foreground font-medium whitespace-nowrap">Role</TableHead>
                      <TableHead className="text-muted-foreground font-medium whitespace-nowrap hidden md:table-cell">Shift</TableHead>
                      <TableHead className="text-muted-foreground font-medium text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((s) => (
                      <TableRow key={s.id} className="border-slate-100">
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium shrink-0">
                              {getInitials(s.name)}
                            </div>
                            <span className="text-sm font-medium">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground py-3.5 hidden sm:table-cell">{s.email}</TableCell>
                        <TableCell className="py-3.5">
                          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-normal border-0 shadow-none whitespace-nowrap">
                            {s.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm py-3.5 hidden md:table-cell">{s.shift}</TableCell>
                        <TableCell className="py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => setEditUser({ ...s })}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteStaff(s.id, s.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base font-semibold mb-2">Notification Preferences</h3>
              <div className="divide-y divide-slate-100">
                {notificationItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4 py-4 first:pt-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100">
                <Button onClick={() => toast({ title: "Notification preferences saved" })}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base font-semibold mb-6">System Preferences</h3>
              <div className="max-w-lg space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Language</Label>
                  <Select value={preferences.language} onValueChange={(v) => setPreferences({ ...preferences, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-AU">English (Australia)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Time Zone</Label>
                  <Select value={preferences.timezone} onValueChange={(v) => setPreferences({ ...preferences, timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Australia/Sydney">Australia/Sydney (AEST)</SelectItem>
                      <SelectItem value="Australia/Melbourne">Australia/Melbourne (AEST)</SelectItem>
                      <SelectItem value="Australia/Perth">Australia/Perth (AWST)</SelectItem>
                      <SelectItem value="Australia/Brisbane">Australia/Brisbane (AEST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(v) => setPreferences({ ...preferences, dateFormat: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 divide-y divide-slate-100 max-w-lg">
                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium">Compact View</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Show more items in lists</p>
                  </div>
                  <Switch
                    checked={preferences.compactView}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, compactView: checked })}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium">Auto-refresh</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Automatically refresh data every 5 minutes</p>
                  </div>
                  <Switch
                    checked={preferences.autoRefresh}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, autoRefresh: checked })}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
              <Button
                className="mt-6"
                onClick={() => toast({ title: "Preferences saved", description: "Your system preferences have been updated." })}
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Full Name</Label>
              <Input value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Email</Label>
              <Input type="email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Role</Label>
                <Select value={newStaff.role} onValueChange={(v) => setNewStaff({ ...newStaff, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {staffRoles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Shift</Label>
                <Select value={newStaff.shift} onValueChange={(v) => setNewStaff({ ...newStaff, shift: v as StaffUser["shift"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Full Name</Label>
                <Input value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Email</Label>
                <Input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">Role</Label>
                  <Select value={editUser.role} onValueChange={(v) => setEditUser({ ...editUser, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {staffRoles.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Shift</Label>
                  <Select value={editUser.shift} onValueChange={(v) => setEditUser({ ...editUser, shift: v as StaffUser["shift"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Afternoon">Afternoon</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleEditStaff}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
