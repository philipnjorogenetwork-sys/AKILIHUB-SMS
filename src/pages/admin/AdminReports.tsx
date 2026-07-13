import { students, attendanceRecords, examResults, exams, feePayments } from "@/data/schoolData";
import { FileText, Download } from "lucide-react";

export default function AdminReports() {
  const reports = [
    { title: "Report Cards", description: "Generate report cards for all students by grade", icon: FileText, action: "Generate" },
    { title: "Attendance Report", description: "Weekly/monthly attendance statistics by class", icon: FileText, action: "Export Excel" },
    { title: "Fee Balance Report", description: "Outstanding fee balances for all students", icon: FileText, action: "Generate" },
    { title: "Payment Receipts", description: "Generate and send receipts via WhatsApp", icon: FileText, action: "Send" },
    { title: "Certificates", description: "Generate certificates for achievements", icon: FileText, action: "Generate" },
    { title: "Exam Results Summary", description: "Grade-wise exam performance report", icon: FileText, action: "Export" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Reports & Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r => (
          <div key={r.title} className="bg-card border border-border rounded-xl p-5 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <r.icon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">{r.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4 flex-1">{r.description}</p>
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />{r.action}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Quick Stats Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-secondary rounded-lg p-3"><p className="text-muted-foreground text-xs">Total Students</p><p className="text-xl font-bold">{students.length}</p></div>
          <div className="bg-secondary rounded-lg p-3"><p className="text-muted-foreground text-xs">Exams Recorded</p><p className="text-xl font-bold">{exams.length}</p></div>
          <div className="bg-secondary rounded-lg p-3"><p className="text-muted-foreground text-xs">Total Payments</p><p className="text-xl font-bold">{feePayments.length}</p></div>
          <div className="bg-secondary rounded-lg p-3"><p className="text-muted-foreground text-xs">Attendance Records</p><p className="text-xl font-bold">{attendanceRecords.length}</p></div>
        </div>
      </div>
    </div>
  );
}
