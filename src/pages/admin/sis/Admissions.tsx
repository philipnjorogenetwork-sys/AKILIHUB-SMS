import { useState, useMemo } from "react";
import { useAdminData } from "@/contexts/AdminDataContext";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search, CheckCircle2, Clock, AlertCircle, Eye, Edit2, X, Calendar, FileText, Phone, Mail, Download
} from "lucide-react";
import { admissionApplications as initialApps, type AdmissionApplication } from "@/data/schoolData";
import { toast } from "sonner";

export default function Admissions() {
  const { admissions, updateAdmission, deleteAdmission } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // Use context admissions or fallback to initial data
  const appsList = admissions.length > 0 ? admissions : initialApps;

  const stats = useMemo(() => {
    return {
      pending: appsList.filter(a => a.status === "pending").length,
      approved: appsList.filter(a => a.status === "approved").length,
      rejected: appsList.filter(a => a.status === "rejected").length,
      interview: appsList.filter(a => a.status === "interview").length,
      total: appsList.length
    };
  }, [appsList]);

  const filteredApps = appsList.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleReschedule = () => {
    if (!rescheduleDate || !selectedApp) {
      toast.error("Please select a date");
      return;
    }
    updateAdmission({
      ...selectedApp,
      interviewDate: rescheduleDate,
      status: "interview"
    });
    toast.success("Interview rescheduled successfully");
    setShowRescheduleDialog(false);
    setShowDetailDialog(false);
  };

  const handleReject = () => {
    if (!rejectReason.trim() || !selectedApp) {
      toast.error("Please provide a rejection reason");
      return;
    }
    updateAdmission({
      ...selectedApp,
      status: "rejected",
      notes: (selectedApp.notes || "") + `\n[REJECTED] ${rejectReason}`
    });
    toast.success("Application rejected");
    setShowRejectDialog(false);
    setShowDetailDialog(false);
  };

  const handleApprove = () => {
    if (!selectedApp) return;
    updateAdmission({
      ...selectedApp,
      status: "approved",
      enrollmentDate: new Date().toISOString().split("T")[0]
    });
    toast.success("Application approved");
    setShowDetailDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-emerald-100 text-emerald-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "interview": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="h-4 w-4" />;
      case "rejected": return <X className="h-4 w-4" />;
      case "interview": return <Calendar className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admissions Management</h1>
          <p className="text-muted-foreground">Manage student applications and enrollment process</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <FileText className="mr-2 h-4 w-4" /> New Application
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "bg-blue-500/20 text-blue-600" },
          { label: "Pending", value: stats.pending, color: "bg-yellow-500/20 text-yellow-600" },
          { label: "Interview", value: stats.interview, color: "bg-purple-500/20 text-purple-600" },
          { label: "Approved", value: stats.approved, color: "bg-emerald-500/20 text-emerald-600" },
          { label: "Rejected", value: stats.rejected, color: "bg-red-500/20 text-red-600" }
        ].map((stat, idx) => (
          <Card key={idx} className="p-4">
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold mt-2 ${stat.color.split(" ")[1]}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="interview">Interview</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map(app => (
          <Card
            key={app.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedApp(app);
              setShowDetailDialog(true);
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{app.studentName}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{app.parentName}</p>
                </div>
                <Badge className={getStatusColor(app.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(app.status)}
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {app.parentEmail}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {app.parentPhone}
              </div>
              {app.interviewDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Interview: {app.interviewDate}</span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Eye
                  className="h-4 w-4 text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info("Birth Certificate: " + (app.documents?.birthCertificate || "Not uploaded"));
                  }}
                />
                <FileText className="h-4 w-4 text-green-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedApp?.studentName}</DialogTitle>
            <DialogDescription>Application details and actions</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parent Name</p>
                  <p className="text-sm mt-1">{selectedApp.parentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm mt-1">{selectedApp.parentEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm mt-1">{selectedApp.parentPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-sm mt-1 capitalize">{selectedApp.status}</p>
                </div>
                {selectedApp.interviewDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Interview Date</p>
                    <p className="text-sm mt-1">{selectedApp.interviewDate}</p>
                  </div>
                )}
              </div>

              {selectedApp.notes && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                  <p className="text-sm text-foreground">{selectedApp.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-border pt-4 flex flex-wrap gap-2">
                {selectedApp.status !== "approved" && selectedApp.status !== "rejected" && (
                  <>
                    <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Calendar className="mr-2 h-4 w-4" /> Reschedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reschedule Interview</DialogTitle>
                          <DialogDescription>Select a new interview date</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <input
                            type="date"
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg"
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>Cancel</Button>
                          <Button onClick={handleReschedule}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button onClick={handleApprove} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                    </Button>

                    <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-red-600 hover:bg-red-700">
                          <X className="mr-2 h-4 w-4" /> Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Application</DialogTitle>
                          <DialogDescription>Provide a reason for rejection</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <textarea
                            placeholder="Rejection reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg min-h-[100px]"
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={handleReject}>Reject</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}

                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> View Documents
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
