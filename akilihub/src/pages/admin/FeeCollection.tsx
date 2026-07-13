import { useState } from "react";
import { students, feePayments as initialPayments, type FeePayment } from "@/data/schoolData";
import { Search, CreditCard } from "lucide-react";

export default function FeeCollection() {
  const [payments, setPayments] = useState<FeePayment[]>([...initialPayments]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"mpesa" | "cash" | "bank">("mpesa");

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.admissionNo.toLowerCase().includes(search.toLowerCase()));
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !amount) return;
    const payment: FeePayment = { id: `FP${String(payments.length + 1).padStart(3, "0")}`, studentId: selectedStudent, amount: Number(amount), date: new Date().toISOString().split("T")[0], method, reference: `REF${Date.now()}`, status: "completed" };
    setPayments(prev => [...prev, payment]);
    setAmount(""); setSelectedStudent("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Fee Collection</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4" />Record Payment</h3>
          <form onSubmit={handlePayment} className="space-y-3">
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className={inputCls} required>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.admissionNo}) - Balance: KSh {s.feeBalance.toLocaleString()}</option>)}
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
                <th className="text-left py-2 px-3">Student</th><th className="text-left py-2 px-3">Amount</th><th className="text-left py-2 px-3">Date</th><th className="text-left py-2 px-3">Method</th><th className="text-left py-2 px-3">Reference</th><th className="text-left py-2 px-3">Status</th>
              </tr></thead>
              <tbody>
                {payments.slice().reverse().map(p => {
                  const st = students.find(s => s.id === p.studentId);
                  return (
                    <tr key={p.id} className="border-b border-border">
                      <td className="py-2 px-3">{st?.name}</td>
                      <td className="py-2 px-3 font-medium">KSh {p.amount.toLocaleString()}</td>
                      <td className="py-2 px-3 text-muted-foreground">{p.date}</td>
                      <td className="py-2 px-3"><span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded uppercase">{p.method}</span></td>
                      <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{p.reference}</td>
                      <td className="py-2 px-3"><span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">{p.status}</span></td>
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
