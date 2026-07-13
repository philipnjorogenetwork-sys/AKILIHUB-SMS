import { useState } from "react";
import { useUserManagement } from "@/contexts/UserManagementContext";
import { useAuth } from "@/contexts/AuthContext";
import { Key, Trash2, Search, Edit2, X, CheckCircle2, Copy, Clock } from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 50;

export default function CredentialGenerator() {
  const { teachers, students, parents, credentials, issueCredential, editCredential, deleteCredential, deleteTeacher, deleteStudent, deleteParent, updateCredentialStatus, updateUserInformation } = useUserManagement();
  const { registerUser, deleteAccount, getUserByPersonId } = useAuth();
  
  // Combine all users with their credentials status
  const allUsers = [
    ...teachers.map(t => ({ id: t.id, name: t.name, email: t.email, role: "teacher" as const, personId: t.id })),
    ...students.map(s => ({ id: s.id, name: s.name, email: s.email, role: "student" as const, personId: s.id, schoolCode: s.schoolCode, admissionNo: s.admissionNo })),
    ...parents.map(p => ({ id: p.id, name: p.name, email: p.email, role: "parent" as const, personId: p.id })),
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCredId, setEditingCredId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingPassword, setEditingPassword] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingStatus, setEditingStatus] = useState<"active" | "pending">("active");
  const [editingRole, setEditingRole] = useState<string>("");


  // Filter users
  const filteredUsers = allUsers.filter(u => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.schoolCode?.toLowerCase().includes(term) ?? false) ||
      (u.admissionNo?.toLowerCase().includes(term) ?? false);
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getCredential = (personId: string) => credentials.find(c => c.personId === personId);

  const handleIssueCredential = (personId: string, email: string, role: string, schoolCode?: string, admissionNo?: string) => {
    const isStudent = role === "student";
    const password = isStudent ? "" : `${role}${Math.floor(100000 + Math.random() * 900000)}`;

    issueCredential(personId, email, password, role as "teacher" | "student" | "parent");

    const existingAccount = getUserByPersonId(personId);
    if (!existingAccount) {
      registerUser({
        id: `U${Math.floor(1000 + Math.random() * 9000)}`,
        email,
        password,
        role: role as "teacher" | "student" | "parent",
        personId,
        name: [teachers, students, parents].flat().find(u => u.id === personId)?.name || "Unknown",
        status: "active",
      });
    }

    toast.success(`Credentials issued for ${email}`, {
      description: isStudent
        ? "Student portal access has been granted. They will sign in with School Code and Admission Number."
        : `Password: ${password}`,
      duration: 8000,
    });
  };

  const handleEditPassword = (credId: string) => {
    if (editingStatus === ("none" as any)) {
      deleteCredential(credId);
      toast.success("Credential removed (Status: Does Not Exist)");
    } else {
      if (!editingPassword.trim()) {
        toast.error("Password cannot be empty");
        return;
      }
      editCredential(credId, editingPassword);
      updateCredentialStatus(credId, editingStatus as "active" | "pending");
      toast.success("Credential updated successfully!");
    }
    setEditingCredId(null);
    setEditingPassword("");
    setEditingEmail("");
    setEditingName("");
  };

  const handleUpdateUserInfo = () => {
    if (!editingUserId) return;
    if (!editingName.trim() || !editingEmail.trim()) {
      toast.error("Name and Email are required");
      return;
    }
    updateUserInformation(editingUserId, editingRole, { name: editingName, email: editingEmail });
    toast.success("User information updated!");
    setEditingUserId(null);
    setEditingName("");
    setEditingEmail("");
    setEditingRole("");
  };

  const handleDeleteUser = (personId: string, name: string, role: string) => {
    const credential = getCredential(personId);
    if (credential) {
      deleteCredential(credential.id);
    }
    
    // Remove from auth as well so they can't login
    deleteAccount(personId);
    
    // Delete user from appropriate list
    if (role === "teacher") deleteTeacher(personId);
    else if (role === "student") deleteStudent(personId);
    else if (role === "parent") deleteParent(personId);
    
    toast.success(`${name} and credentials removed from system!`);
  };

  const copyPassword = (password: string, email: string) => {
    navigator.clipboard.writeText(password);
    toast.success(`Password copied for ${email}`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher": return "bg-blue-500/20 text-blue-700";
      case "student": return "bg-green-500/20 text-green-700";
      case "parent": return "bg-purple-500/20 text-purple-700";
      default: return "bg-gray-500/20 text-gray-700";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Key className="w-8 h-8 text-orange-500" />
          Credential Manager
        </h1>
        <p className="text-muted-foreground">Issue and manage login credentials for teachers, students, and parents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-muted-foreground text-sm">Total Users</p>
          <p className="text-2xl font-bold">{allUsers.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-muted-foreground text-sm">With Credentials</p>
          <p className="text-2xl font-bold text-green-600">{credentials.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-muted-foreground text-sm">Pending Credentials</p>
          <p className="text-2xl font-bold text-amber-600">{allUsers.length - credentials.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-muted-foreground text-sm">Showing</p>
          <p className="text-2xl font-bold">{filteredUsers.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select 
          className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedRole}
          onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">All Roles</option>
          <option value="teacher">Teachers</option>
          <option value="student">Students</option>
          <option value="parent">Parents</option>
        </select>
        <div className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm flex items-center justify-center text-muted-foreground">
          Page {currentPage} of {totalPages || 1}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-border">
              <th className="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Credentials</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedUsers.map(user => {
              const cred = getCredential(user.personId);
              const isPending = !cred;

              return (
                <tr key={user.id} className={`hover:bg-secondary/20 transition-colors ${isPending ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    {editingUserId === user.id ? (
                      <input 
                        type="text" 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full bg-white border border-border rounded px-2 py-1 text-sm font-medium"
                      />
                    ) : (
                      <div className="font-medium text-foreground">{user.name}</div>
                    )}
                    <div className="text-[10px] text-muted-foreground">ID: {user.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${getRoleColor(user.role)}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    {editingUserId === user.id ? (
                      <input 
                        type="email" 
                        value={editingEmail} 
                        onChange={(e) => setEditingEmail(e.target.value)}
                        className="w-full bg-white border border-border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                        {user.role === "student" && user.schoolCode && user.admissionNo ? (
                          <div className="text-[10px] text-gray-500 mt-1">
                            {user.schoolCode} · {user.admissionNo}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {cred ? (
                      <div className={`flex items-center gap-1 font-semibold text-xs ${cred.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                        {cred.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {cred.status === 'active' ? 'Active' : 'Pending'}
                      </div>
                    ) : (
                      <div className="text-rose-600 font-semibold text-[10px] uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded border border-rose-100 w-fit">Does Not Exist</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {cred ? (
                      <div className="space-y-2 text-xs">
                        {editingCredId === cred.id ? (
                          <div className="space-y-2">
                            <input
                              type="email"
                              value={editingEmail}
                              onChange={(e) => setEditingEmail(e.target.value)}
                              placeholder="Email"
                              className="w-full bg-secondary border border-border rounded px-2 py-1"
                            />
                            <input
                              type="text"
                              value={editingPassword}
                              onChange={(e) => setEditingPassword(e.target.value)}
                              placeholder="New password"
                              className="w-full bg-secondary border border-border rounded px-2 py-1"
                            />
                            <select
                              value={editingStatus}
                              onChange={(e) => setEditingStatus(e.target.value as any)}
                              className="w-full bg-secondary border border-border rounded px-2 py-1"
                            >
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                              <option value="none">Does Not Exist (Revoke)</option>
                            </select>
                            <div className="flex gap-1">
                              <button onClick={() => handleEditPassword(cred.id)} className="flex-1 bg-green-500 text-white px-2 py-1 rounded hover:opacity-90 text-[10px] font-semibold">Save</button>
                              <button onClick={() => setEditingCredId(null)} className="flex-1 bg-gray-500 text-white px-2 py-1 rounded hover:opacity-90 text-[10px] font-semibold">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                            <span className="font-mono">••••••••</span>
                            <div className="flex gap-1">
                              <button onClick={() => copyPassword(cred.password, user.email)} title="Copy password" className="text-primary hover:opacity-70">
                                <Copy className="w-3 h-3" />
                              </button>
                              <button onClick={() => { setEditingCredId(cred.id); setEditingPassword(cred.password); setEditingEmail(user.email); setEditingStatus(cred.status as "active" | "pending"); }} title="Edit password" className="text-primary hover:opacity-70">
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="text-muted-foreground">Issued: {new Date(cred.issuedAt).toLocaleDateString()}</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleIssueCredential(user.personId, user.email, user.role, user.schoolCode, user.admissionNo)}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Key className="w-3 h-3" />
                        {user.role === "student" ? "Grant student portal" : "Issue"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {editingUserId === user.id ? (
                        <>
                          <button onClick={handleUpdateUserInfo} className="text-green-600 hover:opacity-70" title="Save user information">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingUserId(null)} className="text-muted-foreground hover:opacity-70" title="Cancel editing">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { setEditingUserId(user.id); setEditingName(user.name); setEditingEmail(user.email); setEditingRole(user.role); }}
                          className="text-primary hover:opacity-70 transition-opacity"
                          title="Edit user information"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.personId, user.name, user.role)}
                        className="text-destructive hover:opacity-70 transition-opacity"
                        title="Delete user and credentials"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paginatedUsers.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No results found for your search.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-border rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-border rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
