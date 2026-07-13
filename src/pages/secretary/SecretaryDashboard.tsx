import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, FileCheck, Users, Clock, ArrowRight, RotateCcw } from "lucide-react";
import { admissionApplications } from "@/data/schoolData";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SecretaryDashboard() {
  const { currentTerm, setCurrentTerm, stats, resetStats } = useDashboardData();

  const handleClearAllData = () => {
    resetStats();
    toast.success("Secretary dashboard reset to 0");
  };

  const dashStats = [
    { title: "Total Applications", value: stats.admissionInquiries.toString(), icon: FileCheck, color: "text-orange-600" },
    { title: "In Review", value: admissionApplications.filter(a => a.status === "review").length.toString(), icon: Clock, color: "text-amber-600" },
    { title: "Approved (Term 1)", value: admissionApplications.filter(a => a.status === "approved").length.toString(), icon: UserPlus, color: "text-emerald-600" },
    { title: "Total Students", value: stats.totalStudents.toString(), icon: Users, color: "text-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Secretary Dashboard</h1>
          <p className="text-muted-foreground">Manage admissions, student records and general school enquiries.</p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClearAllData}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to 0
        </Button>
      </div>

      {/* Term Selection */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3">Select Academic Term</h3>
        <div className="flex gap-3">
          {["Term 1", "Term 2", "Term 3"].map((term) => (
            <Button
              key={term}
              variant={currentTerm === term ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCurrentTerm(term as "Term 1" | "Term 2" | "Term 3");
                toast.info(`Switched to ${term} data`);
              }}
              className="flex-1"
            >
              {term}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Current Term: <span className="font-semibold">{currentTerm}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Admission Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admissionApplications.map((app) => (
                <div key={app.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{app.studentName}</div>
                    <div className="text-xs text-muted-foreground">{app.grade} • Applied on {app.date}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      app.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                      app.status === "review" ? "bg-orange-100 text-orange-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {app.status}
                    </span>
                    <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${app.progress}%` }} />
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border bg-secondary hover:bg-accent transition-colors text-sm font-medium flex items-center justify-between">
              New Application <UserPlus className="h-4 w-4" />
            </button>
            <button className="w-full text-left p-3 rounded-lg border bg-secondary hover:bg-accent transition-colors text-sm font-medium flex items-center justify-between">
              Bulk Import Students <FileCheck className="h-4 w-4" />
            </button>
            <button className="w-full text-left p-3 rounded-lg border bg-secondary hover:bg-accent transition-colors text-sm font-medium flex items-center justify-between">
              Generate ID Cards <Users className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
