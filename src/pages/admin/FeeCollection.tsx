import { useState, useMemo } from "react";
import { students, type FeePayment } from "@/data/schoolData";
import { useAdminData } from "@/contexts/AdminDataContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useUserManagement } from "@/contexts/UserManagementContext";
import { downloadCSV } from "@/utils/fileOperations";
import { Search, CreditCard, Download, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function FeeCollection() {
  const { payments, addPayment, deletePayment } = useAdminData();
  const { incrementStat, updateStats, resetFinancialData } = useDashboardData();
  const { students: allStudents, updateStudent } = useUserManagement();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"mpesa" | "cash" | "bank">("mpesa");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("Term 1");

  const filteredStudents = allStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.admissionNo.toLowerCase().includes(search.toLowerCase()));
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  // Calculate total outstanding fees from all students
  const totalOutstanding = allStudents.reduce((sum, s) => sum + s.feeBalance, 0);

  const stats = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    return {
      totalCollected: total,
      totalPayments: payments.length,
      averagePayment: payments.length > 0 ? Math.round(total / payments.length) : 0,
    };
  }, [payments]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    const newPayment: FeePayment = {
      id: `FP${String(payments.length + 1).padStart(3, "0")}`,
      studentId: selectedStudent,
      amount: Number(amount),
      date: new Date().toISOString().split("T")[0],
      method,
      reference: `REF${Date.now()}`,
      status: "completed",
    };
    addPayment(newPayment);
    
    // Update student's fee balance
    const student = allStudents.find(s => s.id === selectedStudent);
    if (student) {
      const newBalance = Math.max(0, student.feeBalance - Number(amount));
      updateStudent(selectedStudent, { feeBalance: newBalance });
    }
    
    // Update dashboard stats - revenue and outstanding fees
    incrementStat("revenue", Number(amount));
    const newOutstanding = totalOutstanding - Number(amount);
    updateStats({ outstandingFees: Math.max(0, newOutstanding) });
    
    toast.success("Payment recorded successfully");
    setAmount("");
    setSelectedStudent("");
  };

  const handleExportData = () => {
    const dataToExport = payments.map(p => {
      const st = allStudents.find(s => s.id === p.studentId);
      return {
        "Student Name": st?.name || "Unknown",
        "Admission No": st?.admissionNo || "N/A",
        "Amount (KSh)": p.amount,
        "Date": p.date,
        "Method": p.method,
        "Reference": p.reference,
        "Status": p.status,
      };
    });
    downloadCSV(dataToExport, `fee-collection-${selectedTerm.replace(" ", "-")}-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("Data exported successfully");
  };

  const handleClearTermData = () => {
    // In a real app, this would clear term-specific data
    toast.info(`Clearing ${selectedTerm} data...`);
    setShowClearDialog(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Collection</h1>
          <p className="text-muted-foreground">Track and manage student fee payments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportData} className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button 
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all financial data (revenue and outstanding fees) to 0?")) {
                resetFinancialData();
                toast.success("All financial data reset to 0");
              }
            }}
            variant="destructive"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Financial Data
          </Button>
          <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="mr-2 h-4 w-4" /> Clear Term Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear Term Data</DialogTitle>
                <DialogDescription>
                  This action will clear all fee collection data for {selectedTerm}. This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className={inputCls}>
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                </select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowClearDialog(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleClearTermData}>Clear Data</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold mt-2">KSh {stats.totalCollected.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
              <p className="text-2xl font-bold mt-2">{stats.totalPayments}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Payment</p>
              <p className="text-2xl font-bold mt-2">KSh {stats.averagePayment.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/20 text-orange-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Record Payment</h3>
          <form onSubmit={handlePayment} className="space-y-3">
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className={inputCls} required>
              <option value="">Select Student</option>
              {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.admissionNo}) - Balance: KSh {s.feeBalance.toLocaleString()}</option>)}
            </select>
            <input type="number" placeholder="Amount (KSh)" value={amount} onChange={e => setAmount(e.target.value)} className={inputCls} required />
            <select value={method} onChange={e => setMethod(e.target.value as any)} className={inputCls}>
              <option value="mpesa">M-Pesa</option><option value="cash">Cash</option><option value="bank">Bank Transfer</option>
            </select>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90">Record Payment</button>
          </form>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-3">Student</th><th className="text-left py-2 px-3">Amount</th><th className="text-left py-2 px-3">Date</th><th className="text-left py-2 px-3">Method</th><th className="text-left py-2 px-3">Reference</th><th className="text-left py-2 px-3">Action</th>
              </tr></thead>
              <tbody>
                {payments.slice().reverse().map(p => {
                  const st = allStudents.find(s => s.id === p.studentId);
                  return (
                    <tr key={p.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="py-2 px-3">{st?.name}</td>
                      <td className="py-2 px-3 font-medium">KSh {p.amount.toLocaleString()}</td>
                      <td className="py-2 px-3 text-muted-foreground">{p.date}</td>
                      <td className="py-2 px-3"><span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded uppercase">{p.method}</span></td>
                      <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{p.reference}</td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => {
                            deletePayment(p.id);
                            
                            // Restore student's fee balance
                            const student = allStudents.find(s => s.id === p.studentId);
                            if (student) {
                              updateStudent(p.studentId, { feeBalance: student.feeBalance + p.amount });
                            }
                            
                            // Update dashboard stats - revenue and outstanding fees
                            incrementStat("revenue", -p.amount);
                            const newOutstanding = totalOutstanding + p.amount;
                            updateStats({ outstandingFees: newOutstanding });
                            
                            toast.success("Payment deleted");
                          }}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
