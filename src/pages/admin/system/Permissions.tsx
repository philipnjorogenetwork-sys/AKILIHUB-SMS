import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { userAccounts, type UserAccount } from "@/data/schoolData";
import { updateUser } from "@/services/backendSync";
import { toast } from "sonner";

const permissionModules = [
  "Dashboard",
  "Admissions",
  "Student Records",
  "Attendance",
  "Marks & Exams",
  "Fees",
  "Reports",
  "Messages",
  "Settings",
];

const rolePermissions: Record<string, string[]> = {
  Admin: permissionModules,
  teacher: ["Dashboard", "Attendance", "Marks & Exams", "Messages"],
  student: ["Dashboard", "Messages"],
  parent: ["Dashboard", "Fees", "Messages"],
  finance: ["Dashboard", "Fees", "Reports"],
  secretary: ["Dashboard", "Admissions", "Student Records", "Fees", "Messages"],
};

export default function Permissions() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [selectedUserId, setSelectedUserId] = useState("U001");
  const [isSaving, setIsSaving] = useState(false);
  const [granted, setGranted] = useState<Record<string, boolean>>({
    Dashboard: true,
    Admissions: true,
    "Student Records": true,
    Attendance: true,
    "Marks & Exams": true,
    Fees: true,
    Reports: true,
    Messages: true,
    Settings: true,
  });

  const users = userAccounts as UserAccount[];

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) => [user.name, user.email, user.role].some((value) => value.toLowerCase().includes(term)));
  }, [search, users]);

  const roleOptions = Array.from(new Set(users.map((user) => user.role)));

  const toggleModule = (module: string) => {
    setGranted((prev) => ({ ...prev, [module]: !prev[module] }));
  };

  const handleSavePermissions = async () => {
    const selectedUser = users.find((user) => user.id === selectedUserId);
    if (!selectedUser) {
      toast.error("Select a user before saving permissions.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateUser(selectedUser.id, {
        name: selectedUser.name,
        address: Object.keys(granted).filter((module) => granted[module]).join(", "),
      });

      if (!response.ok) {
        throw new Error(response.data?.message || "Permissions could not be synced to the backend");
      }

      toast.success(`Permissions saved for ${selectedUser.name}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sync permissions");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
        <p className="text-muted-foreground">Assign functionality access by role and by individual user.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle>By role</CardTitle>
            <p className="text-sm text-muted-foreground">Choose a role and select the modules this role may access.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="rounded-xl border border-border/70 bg-secondary/40 p-4">
              <div className="mb-3 font-medium">Available modules for {selectedRole}</div>
              <div className="grid gap-3 md:grid-cols-2">
                {rolePermissions[selectedRole]?.map((module) => (
                  <label key={module} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
                    <Checkbox checked={granted[module] ?? false} onCheckedChange={() => toggleModule(module)} />
                    <span>{module}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle>By user</CardTitle>
            <p className="text-sm text-muted-foreground">Select a specific user and grant permissions for individual modules.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search user" className="pl-10" />
            </div>
            <div className="max-h-60 space-y-2 overflow-auto rounded-xl border border-border/70 p-3">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUserId(user.id)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${selectedUserId === user.id ? "border-primary bg-primary/10" : "border-border/60 bg-background"}`}
                >
                  <span>{user.name}</span>
                  <span className="text-muted-foreground">{user.role}</span>
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-border/70 bg-secondary/40 p-4">
              <div className="mb-3 font-medium">Modules for {filteredUsers.find((user) => user.id === selectedUserId)?.name || "selected user"}</div>
              <div className="grid gap-3">
                {permissionModules.map((module) => (
                  <label key={module} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
                    <Checkbox checked={granted[module] ?? false} onCheckedChange={() => toggleModule(module)} />
                    <span>{module}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={handleSavePermissions} disabled={isSaving}>{isSaving ? "Saving..." : "Save Permissions"}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
