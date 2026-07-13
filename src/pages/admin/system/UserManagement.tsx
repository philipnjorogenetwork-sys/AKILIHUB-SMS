import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldCheck, UserCog } from "lucide-react";
import { userAccounts, type UserAccount } from "@/data/schoolData";
import { createUser } from "@/services/backendSync";
import { toast } from "sonner";

const roleStyles: Record<string, string> = {
  Admin: "bg-red-100 text-red-800",
  teacher: "bg-emerald-100 text-emerald-800",
  student: "bg-blue-100 text-blue-800",
  parent: "bg-purple-100 text-purple-800",
  finance: "bg-amber-100 text-amber-800",
  secretary: "bg-orange-100 text-orange-800",
};

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserAccount[]>(() => userAccounts as UserAccount[]);

  const handleCreateDemoUser = async () => {
    const payload = {
      email: `sync-${Date.now()}@akilihub.com`,
      password: "Password123",
      name: "Synced User",
      role: "secretary",
      personId: `${Date.now()}`,
    };

    try {
      const response = await createUser(payload);
      if (!response.ok) {
        throw new Error(response.data?.message || "User could not be synced to the backend");
      }

      const newUser: UserAccount = {
        id: `U${Date.now()}`,
        email: payload.email as string,
        password: payload.password as string,
        role: payload.role as UserAccount["role"],
        personId: payload.personId as string,
        name: payload.name as string,
        status: "active",
      };

      setUsers((prev) => [newUser, ...prev]);
      toast.success("User created and synced to the backend.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sync user");
    }
  };

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) => value.toLowerCase().includes(term))
    );
  }, [search, users]);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">View all invited and active users in the institution.</p>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Institution users</CardTitle>
              <p className="text-sm text-muted-foreground">Every user account shown here can be reviewed and managed centrally.</p>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
              <button type="button" onClick={handleCreateDemoUser} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Create synced user</button>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, role or email" className="pl-10" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-primary" />
                  <p className="font-semibold">{user.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={roleStyles[user.role] || "bg-slate-100 text-slate-800"}>{user.role}</Badge>
                <Badge className={user.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}>{user.status}</Badge>
                <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Permissions managed
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
