import { useState } from "react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
  ArrowUpCircle, GraduationCap, CheckCircle2, AlertTriangle, RefreshCw, ChevronRight, Users, Edit2, Save
} from "lucide-react";
import { toast } from "sonner";

export default function StudentPromotion() {
  const { promotions, addPromotion, updatePromotion } = useAdminData();
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [showPromoteDialog, setShowPromoteDialog] = useState(false);
  const [newGrade, setNewGrade] = useState("");

  const grades = [
    { from: "Form 1", to: "Form 2", students: 124 },
    { from: "Form 2", to: "Form 3", students: 118 },
    { from: "Form 3", to: "Form 4", students: 105 },
  ];

  const statistics = [
    { label: "Eligible for Promotion", value: "347", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Needs Review", value: "8", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Already Promoted", value: "0", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const handlePromote = () => {
    if (!selectedPromotion || !newGrade) {
      toast.error("Please select all fields");
      return;
    }
    const promotion = {
      id: `PROMO${Date.now()}`,
      from: selectedPromotion.from,
      to: newGrade,
      studentCount: selectedPromotion.students,
      promotedCount: selectedPromotion.students,
      date: new Date().toISOString().split("T")[0],
      status: "completed"
    };
    addPromotion(promotion);
    toast.success(`Successfully promoted ${selectedPromotion.students} students from ${selectedPromotion.from} to ${newGrade}`);
    setShowPromoteDialog(false);
    setSelectedPromotion(null);
    setNewGrade("");
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Promotion</h1>
          <p className="text-muted-foreground">Manage the transition of students to the next academic level</p>
        </div>
        <Dialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowUpCircle className="mr-2 h-4 w-4" /> Promote Students
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Promote Students</DialogTitle>
              <DialogDescription>Select grade levels and promote students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">From Grade</label>
                <select
                  value={selectedPromotion?.from || ""}
                  onChange={(e) => {
                    const selected = grades.find(g => g.from === e.target.value);
                    setSelectedPromotion(selected);
                  }}
                  className="w-full px-4 py-2 mt-2 bg-secondary border border-border rounded-lg text-sm"
                >
                  <option value="">Select from grade...</option>
                  {grades.map(g => (
                    <option key={g.from} value={g.from}>{g.from}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">To Grade</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-4 py-2 mt-2 bg-secondary border border-border rounded-lg text-sm"
                >
                  <option value="">Select to grade...</option>
                  <option value="Form 2">Form 2</option>
                  <option value="Form 3">Form 3</option>
                  <option value="Form 4">Form 4</option>
                  <option value="Form 5">Form 5</option>
                </select>
              </div>
              {selectedPromotion && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    {selectedPromotion.students} students will be promoted
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPromoteDialog(false)}>Cancel</Button>
              <Button onClick={handlePromote} className="bg-emerald-600 hover:bg-emerald-700">Confirm Promotion</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statistics.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground uppercase">{stat.label}</p>
              <h3 className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Promotion Workflows */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Promotion Workflows</CardTitle>
            <CardDescription>Manage promotion cycles for each grade level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {grades.map((grade, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <div
                      onClick={() => setSelectedPromotion(grade)}
                      className="p-4 rounded-xl border flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{grade.from} to {grade.to}</p>
                          <p className="text-xs text-muted-foreground">{grade.students} Students</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Promote {grade.from} to {grade.to}</DialogTitle>
                      <DialogDescription>Review and confirm promotion for {grade.students} students</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Total Students: {grade.students}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Promotion Criteria</label>
                        <select className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm">
                          <option>Automatic - Based on GPA</option>
                          <option>Manual Review Required</option>
                          <option>Merit-Based</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Promote All</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Validation & Review */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Validation Checks</CardTitle>
            <CardDescription>System checks before promotions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase">Academic Requirements</span>
                </div>
                <Badge className="bg-emerald-500">PASSED</Badge>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase">Attendance</span>
                </div>
                <Badge className="bg-emerald-500">PASSED</Badge>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase">Financial Clearance</span>
                </div>
                <Badge className="bg-amber-500">REVIEW NEEDED</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotion History */}
      <Card>
        <CardHeader>
          <CardTitle>Promotion History</CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-bold">From</th>
                    <th className="text-left py-3 px-4 font-bold">To</th>
                    <th className="text-left py-3 px-4 font-bold">Students</th>
                    <th className="text-left py-3 px-4 font-bold">Date</th>
                    <th className="text-left py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map(promo => (
                    <tr key={promo.id} className="border-b hover:bg-muted/20">
                      <td className="py-3 px-4">{promo.from}</td>
                      <td className="py-3 px-4">{promo.to}</td>
                      <td className="py-3 px-4">{promo.promotedCount}/{promo.studentCount}</td>
                      <td className="py-3 px-4">{promo.date}</td>
                      <td className="py-3 px-4"><Badge className="bg-emerald-100 text-emerald-800">{promo.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No promotions recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
