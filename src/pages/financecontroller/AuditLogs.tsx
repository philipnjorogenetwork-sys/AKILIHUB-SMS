import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auditLogs, type AuditLog } from "@/data/schoolData";
import { Activity, ShieldCheck } from "lucide-react";

export default function FinanceAuditLogs() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Audit logs <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </h1>
          <p className="text-muted-foreground">Detailed history of financial and system critical actions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" /> System Events
          </CardTitle>
          <button className="text-xs bg-secondary px-3 py-1 rounded-md hover:bg-accent transition-colors">
            Export to Excel
          </button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === "UPDATE" ? "bg-blue-100 text-blue-700" :
                      log.action === "CREATE" ? "bg-emerald-100 text-emerald-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>{log.module}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{log.details}</TableCell>
                  <TableCell className="text-muted-foreground">{log.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
