import { useState } from "react";
import { useAdminData } from "@/contexts/AdminDataContext";
import { type AdmissionApplication } from "@/data/schoolData";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
  CheckCircle2, Clock, AlertCircle, Eye, Edit2, X, Plus, Calendar, FileText, Phone, Mail
} from "lucide-react";
import { toast } from "sonner";

export default function AllUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Mock all users data - in production, fetch from context
  const allUsers = [
    // Students
    { id: "S001", name: "Kevin Kamau", role: "student", email: "kevin.k@student.com", phone: "0700001001", status: "active", grade: "Form 1", section: "East" },
    { id: "S002", name: "Sharon Kamau", role: "student", email: "sharon.k@student.com", phone: "0700001002", status: "active", grade: "Form 3", section: "East" },
    // Teachers
    { id: "T001", name: "Dr. James Mwangi", role: "teacher", email: "james@school.com", phone: "0722100100", status: "active", subjects: ["Mathematics"] },
    { id: "T002", name: "Prof. Sarah Otieno", role: "teacher", email: "sarah@school.com", phone: "0733200200", status: "active", subjects: ["Physics", "Chemistry"] },
    // Parents
    { id: "P001", name: "Mr. Joseph Kamau", role: "parent", email: "joseph.k@email.com", phone: "0722111001", status: "active", children: ["S001", "S002"] },
    // Admin & Staff
    { id: "Admin", name: "System Administrator", role: "admin", email: "admin@school.com", phone: "0700000001", status: "active" },
    { id: "F001", name: "Moses Finance", role: "finance", email: "moses@gmail.com", phone: "0700000002", status: "active" },
    { id: "SEC001", name: "Njoroge Secretary", role: "secretary", email: "njoroge@gmail.com", phone: "0700000003", status: "active" },
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student": return "bg-blue-100 text-blue-800";
      case "teacher": return "bg-green-100 text-green-800";
      case "parent": return "bg-purple-100 text-purple-800";
      case "admin": return "bg-red-100 text-red-800";
      case "finance": return "bg-yellow-100 text-yellow-800";
      case "secretary": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">Manage all system users and their accounts</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="parent">Parents</option>
          <option value="admin">Admin</option>
          <option value="finance">Finance</option>
          <option value="secretary">Secretary</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setSelectedUser(user); setShowDetailDialog(true); }}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {user.phone}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {user.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              {user.grade && <p className="text-sm"><strong>Grade:</strong> {user.grade} {user.section}</p>}
              {user.subjects && <p className="text-sm"><strong>Subjects:</strong> {user.subjects.join(", ")}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedUser?.name}</DialogTitle>
            <DialogDescription>User account details and actions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm mt-1">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-sm mt-1 capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-sm mt-1 capitalize">{selectedUser.status}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4 flex gap-2">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  <Edit2 className="mr-2 h-4 w-4" /> Edit User
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" /> View Activity
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
