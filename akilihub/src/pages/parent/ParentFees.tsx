import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { parents, getChildrenForParent, feePayments } from "@/data/schoolData";
import { CreditCard, Smartphone, CheckCircle } from "lucide-react";

export default function ParentFees() {
  const { user } = useAuth();
  const parent = parents.find(p => p.id === user?.personId);
  if (!parent) return null;
  const children = getChildrenForParent(parent.id);

  const [selectedChild, setSelectedChild] = useState(children[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(parent.phone);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const child = children.find(c => c.id === selectedChild);
  const childPayments = feePayments.filter(p => p.studentId === selectedChild);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); setTimeout(() => setPaid(false), 3000); }, 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Fee Payment</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Smartphone className="h-4 w-4" />Pay via M-Pesa</h3>
          {paid && <div className="bg-green-500/10 text-green-400 text-sm p-3 rounded-lg mb-4 flex items-center gap-2"><CheckCircle className="h-4 w-4" />STK Push sent! Check your phone.</div>}
          <form onSubmit={handlePay} className="space-y-3">
            <select value={selectedChild} onChange={e => setSelectedChild(e.target.value)} className={inputCls}>
              {children.map(c => <option key={c.id} value={c.id}>{c.name} — Balance: KSh {c.feeBalance.toLocaleString()}</option>)}
            </select>
            <input type="number" placeholder="Amount (KSh)" value={amount} onChange={e => setAmount(e.target.value)} className={inputCls} required />
            <input placeholder="M-Pesa Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} required />
            <button type="submit" disabled={paying} className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              <CreditCard className="h-4 w-4" />{paying ? "Sending STK Push..." : "Pay with M-Pesa"}
            </button>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Fee Summary — {child?.name}</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-secondary rounded-lg p-3"><p className="text-xs text-muted-foreground">Total Fee</p><p className="font-bold">KSh {((child?.feePaid || 0) + (child?.feeBalance || 0)).toLocaleString()}</p></div>
              <div className="bg-secondary rounded-lg p-3"><p className="text-xs text-muted-foreground">Paid</p><p className="font-bold text-green-400">KSh {(child?.feePaid || 0).toLocaleString()}</p></div>
              <div className="bg-secondary rounded-lg p-3"><p className="text-xs text-muted-foreground">Balance</p><p className="font-bold text-red-400">KSh {(child?.feeBalance || 0).toLocaleString()}</p></div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Payment History</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-3">Date</th><th className="text-left py-2 px-3">Amount</th><th className="text-left py-2 px-3">Method</th><th className="text-left py-2 px-3">Reference</th>
              </tr></thead>
              <tbody>
                {childPayments.map(p => (
                  <tr key={p.id} className="border-b border-border">
                    <td className="py-2 px-3">{p.date}</td>
                    <td className="py-2 px-3 font-medium">KSh {p.amount.toLocaleString()}</td>
                    <td className="py-2 px-3"><span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded uppercase">{p.method}</span></td>
                    <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{p.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
