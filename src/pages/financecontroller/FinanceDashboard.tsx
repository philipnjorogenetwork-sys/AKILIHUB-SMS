import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Receipt, BarChart3, TrendingUp, History, RotateCcw } from "lucide-react";
import { feePayments } from "@/data/schoolData";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FinanceDashboard() {
  const { currentTerm, setCurrentTerm, stats, resetStats } = useDashboardData();

  const handleClearAllData = () => {
    resetStats();
    toast.success("Finance dashboard reset to 0");
  };

  const statCards = [
    { title: "Total Revenue", value: `KSh ${stats.revenue.toLocaleString()}`, icon: Wallet, color: "text-emerald-600" },
    { title: "Outstanding Fees", value: `KSh ${stats.outstandingFees.toLocaleString()}`, icon: TrendingUp, color: "text-rose-600" },
    { title: "Recent Payments", value: `${feePayments.length} Total`, icon: Receipt, color: "text-blue-600" },
    { title: "Audit Status", value: "Clean", icon: History, color: "text-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">Manage school revenue, expenses and fee structures.</p>
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
        {statCards.map((stat) => (
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
            <CardTitle>Recent Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feePayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Payment #{payment.reference}</p>
                    <p className="text-xs text-muted-foreground">{payment.date} via {payment.method}</p>
                  </div>
                  <div className="font-medium text-emerald-600">+KSh {payment.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground ">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
              Chart visualization would go here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
