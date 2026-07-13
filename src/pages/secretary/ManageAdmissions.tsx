import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminData } from "@/contexts/AdminDataContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { CheckCircle2, Clock, UserCheck, AlertCircle } from "lucide-react";

export default function ManageAdmissions() {
  const { admissions } = useAdminData();
  const { updateStats } = useDashboardData();

  // Update dashboard stats whenever admissions change
  useEffect(() => {
    const inReview = admissions.filter(a => a.status === "review").length;
    const approved = admissions.filter(a => a.status === "approved").length;
    
    updateStats({
      admissionInquiries: admissions.length,
      pendingApprovals: inReview,
    });
  }, [admissions, updateStats]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "review": return <Clock className="h-4 w-4 text-blue-500" />;
      case "interview": return <UserCheck className="h-4 w-4 text-indigo-500" />;
      default: return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admissions Management</h1>
        <p className="text-muted-foreground">Track and process new student applications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admissions.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.studentName}</TableCell>
                  <TableCell>{app.grade}</TableCell>
                  <TableCell>{app.parentName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 capitalize">
                      {getStatusIcon(app.status)}
                      {app.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${app.progress}%` }} />
                    </div>
                  </TableCell>
                  <TableCell>{app.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
