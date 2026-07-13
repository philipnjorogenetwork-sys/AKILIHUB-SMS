import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, LockKeyhole } from "lucide-react";

const systemCards = [
  {
    title: "User Management",
    description: "Review the institution roster, monitor user status and manage account visibility.",
    href: "/Admin/system/users",
    icon: Users,
  },
  {
    title: "Permissions",
    description: "Grant role-based and user-specific access to school modules and workflows.",
    href: "/Admin/system/permissions",
    icon: LockKeyhole,
  },
];

export default function SystemOverview() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System</h1>
        <p className="text-muted-foreground">Control administration access, user accounts and permissions from one place.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Secure administration workspace</CardTitle>
              <p className="text-sm text-muted-foreground">Manage access for every staff member and parent account in the institution.</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {systemCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-border/70 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-secondary p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <Button asChild className="w-full">
                  <Link to={item.href}>Open {item.title}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
