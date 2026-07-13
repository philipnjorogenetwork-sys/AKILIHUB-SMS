import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, TrendingUp, TrendingDown, Users, DollarSign, 
  Calendar, ArrowUpRight, ArrowDownRight, MoreVertical, 
  Download, PieChart, Activity, Receipt, Wallet, 
  RefreshCw, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";

export default function FinancialOverview() {
  const [loading, setLoading] = useState(false);

  const stats = [
    { title: "Total Revenue", value: "KSh 4,250,000", change: "+12.5%", trending: "up", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Outstanding Fees", value: "KSh 850,000", change: "-2.4%", trending: "down", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Active Subscriptions", value: "1,240", change: "+5.1%", trending: "up", icon: RefreshCw, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Total Expenses", value: "KSh 1,120,000", change: "+8.2%", trending: "up", icon: Wallet, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const recentTransactions = [
    { id: "TXN-8921", student: "Alice Johnson", amount: "KSh 45,000", date: "2024-04-12", status: "completed", type: "Fee Payment" },
    { id: "TXN-8922", student: "Bob Smith", amount: "KSh 32,000", date: "2024-04-13", status: "completed", type: "Tuition" },
    { id: "TXN-8923", student: "Charlie Brown", amount: "KSh 12,000", date: "2024-04-13", status: "pending", type: "Extracurricular" },
    { id: "TXN-8924", student: "Diana Prince", amount: "KSh 55,000", date: "2024-04-14", status: "failed", type: "Fee Payment" },
    { id: "TXN-8925", student: "Evan Wright", amount: "KSh 28,000", date: "2024-04-15", status: "completed", type: "Uniforms" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-emerald-500 hover:bg-emerald-600">Completed</Badge>;
      case "pending": return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      case "failed": return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground">Monitor school revenue, billing, and subscription tracking.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Receipt className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className={`flex items-center text-xs font-semibold ${stat.trending === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.trending === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing & Subscriptions Tracking */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Billing & Subscription Tracking</CardTitle>
              <CardDescription>Real-time monitoring of fee collection and service subscriptions.</CardDescription>
            </div>
            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collection Rate</p>
                     <p className="text-2xl font-bold">82.5%</p>
                     <Progress value={82.5} className="h-1.5" />
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Upsells</p>
                     <p className="text-2xl font-bold">+18</p>
                     <p className="text-[10px] text-emerald-600 font-medium">This academic term</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Churn Risk</p>
                     <p className="text-2xl font-bold text-rose-500">2.1%</p>
                     <p className="text-[10px] text-slate-400 font-medium">Last 30 days</p>
                  </div>
               </div>

               <div className="mt-4">
                 <h4 className="text-sm font-semibold mb-4 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-primary" /> Recent Transactions
                 </h4>
                 <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="text-xs font-bold">Transaction ID</TableHead>
                          <TableHead className="text-xs font-bold">Student</TableHead>
                          <TableHead className="text-xs font-bold">Type</TableHead>
                          <TableHead className="text-xs font-bold">Amount</TableHead>
                          <TableHead className="text-xs font-bold text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTransactions.map((txn) => (
                          <TableRow key={txn.id}>
                            <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                            <TableCell className="text-sm font-medium">{txn.student}</TableCell>
                            <TableCell className="text-xs">{txn.type}</TableCell>
                            <TableCell className="text-sm font-bold">{txn.amount}</TableCell>
                            <TableCell className="text-center">
                              {getStatusBadge(txn.status)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Summary */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Plan Analytics</CardTitle>
            <CardDescription>Breakdown by student subscription plans.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex flex-col items-center justify-center p-6 h-40 bg-slate-50 rounded-xl relative overflow-hidden">
                <PieChart className="h-20 w-20 text-primary opacity-20 absolute" />
                <p className="text-sm font-bold text-slate-600 relative z-10">Revenue Mix</p>
                <div className="flex gap-2 mt-2 relative z-10">
                   <div className="w-3 h-3 rounded-full bg-primary" />
                   <div className="w-3 h-3 rounded-full bg-orange-400" />
                   <div className="w-3 h-3 rounded-full bg-amber-300" />
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium text-slate-700">Premium Plan</span>
                   </div>
                   <span className="text-sm font-bold">45%</span>
                </div>
                <div className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-orange-400" />
                      <span className="text-sm font-medium text-slate-700">Standard Plan</span>
                   </div>
                   <span className="text-sm font-bold">38%</span>
                </div>
                <div className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-amber-300" />
                      <span className="text-sm font-medium text-slate-700">Basic Plan</span>
                   </div>
                   <span className="text-sm font-bold">17%</span>
                </div>
             </div>

             <div className="pt-4 border-t border-border/50">
                <Button variant="outline" className="w-full text-xs">
                   View Subscription Audit
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Channels */}
      <Card className="border-border/50 overflow-hidden">
         <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-border/50">
           <h3 className="font-bold flex items-center gap-2">
             <CreditCard className="h-4 w-4 text-primary" /> Integrated Payment Channels
           </h3>
         </div>
         <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed hover:border-primary transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center font-bold text-green-600">MP</div>
                  <div>
                    <p className="text-xs font-bold">M-Pesa Express</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Connected</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed hover:border-primary transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center font-bold text-orange-600">BK</div>
                  <div>
                    <p className="text-xs font-bold">Bank Transfer</p>
                    <p className="text-[10px] text-orange-600 font-medium">Active</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed hover:border-primary transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-600">CC</div>
                  <div>
                    <p className="text-xs font-bold">Credit/Debit Cards</p>
                    <p className="text-[10px] text-indigo-600 font-medium">Ready</p>
                  </div>
               </div>
               <div className="flex items-center justify-center p-4 rounded-xl border border-dashed hover:bg-slate-50 transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-muted-foreground">+ Add Channel</span>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
