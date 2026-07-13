import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  getUserById, getUserActivity, getUserChatHistory, 
  type ChatMessage, type Conversation 
} from "@/data/schoolData";
import { 
  ArrowLeft, Activity, MessageCircle, Shield, User, 
  Mail, Phone, Calendar, Clock, Lock, Eye, EyeOff,
  ChevronRight, AlertCircle, CheckCircle2, Info, Copy
} from "lucide-react";
import { useState } from "react";
import { useUserManagement } from "@/contexts/UserManagementContext";
import { toast } from "sonner";

export default function AdminUserMonitoring() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = getUserById(userId || "");
  const activity = getUserActivity(userId || "");
  const chatHistory = getUserChatHistory(userId || "");
  const { suspendUser, unsuspendUser, resetUserPassword, students, teachers, parents } = useUserManagement();

  const [activeTab, setActiveTab] = useState<"activity" | "chats" | "details">("activity");
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [isSuspended, setIsSuspended] = useState(() => {
    if (!user) return false;
    if (user.role === "student") {
      return students.find(s => s.id === userId)?.suspended || false;
    } else if (user.role === "teacher") {
      return teachers.find(t => t.id === userId)?.suspended || false;
    } else if (user.role === "parent") {
      return parents.find(p => p.id === userId)?.suspended || false;
    }
    return false;
  });
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">User Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary flex items-center gap-2 justify-center w-full">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  const statusColors = {
    Success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Warning: "bg-amber-50 text-amber-600 border-amber-100",
    Info: "bg-blue-50 text-blue-600 border-blue-100",
    Neutral: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-slate-50 rounded-2xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[1.5rem] bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-black">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{user.name}</h1>
                <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{user.role}</span>
              </div>
              <p className="text-slate-400 font-medium text-sm mt-1 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> 100% Admin Monitoring Access Enabled
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              if (isSuspended) {
                unsuspendUser(userId || "", (user?.role as any) || "student");
                setIsSuspended(false);
                toast.success(`${user?.name} account has been unsuspended`);
              } else {
                suspendUser(userId || "", (user?.role as any) || "student");
                setIsSuspended(true);
                toast.success(`${user?.name} account has been suspended`);
              }
            }}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isSuspended 
                ? "bg-green-50 text-green-600 border border-green-100 hover:bg-green-500 hover:text-white" 
                : "bg-red-50 text-red-600 border border-red-100 hover:bg-red-500 hover:text-white"
            }`}
          >
            {isSuspended ? "Unsuspend Account" : "Suspend Account"}
          </button>
          <button 
            onClick={() => setShowPasswordReset(!showPasswordReset)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
          >
            Reset Password
          </button>
        </div>
      </div>

      {showPasswordReset && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Reset Password</h3>
              <p className="text-xs text-slate-500 mt-2">Generate a temporary password for {user?.name}</p>
            </div>

            {!tempPassword ? (
              <button
                onClick={() => {
                  const newPassword = resetUserPassword(userId || "");
                  setTempPassword(newPassword);
                  toast.success("Temporary password generated");
                }}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-orange-600 transition-all"
              >
                Generate Temporary Password
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">New Temporary Password</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm font-bold text-slate-800 break-all">
                      {tempPassword}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(tempPassword);
                        toast.success("Password copied to clipboard");
                      }}
                      className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                    >
                      <Copy className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Share this password with the user. They should change it on first login.</span>
                </p>
                <button
                  onClick={() => {
                    setShowPasswordReset(false);
                    setTempPassword(null);
                  }}
                  className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-bold uppercase text-sm hover:bg-slate-200 transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Meta */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">User Information</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                   <Mail className="w-5 h-5 text-slate-400" />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Email Address</p>
                      <p className="text-sm font-bold text-slate-800">{user.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                   <Phone className="w-5 h-5 text-slate-400" />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Phone Number</p>
                      <p className="text-sm font-bold text-slate-800">+254 700 000 000</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                   <Calendar className="w-5 h-5 text-slate-400" />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Joined On</p>
                      <p className="text-sm font-bold text-slate-800">January 12, 2026</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2.5rem] shadow-xl text-white">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Login Security</h3>
                <Lock className="w-4 h-4 text-orange-400" />
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                   <span className="text-sm font-medium text-white/70">Last Login IP</span>
                   <span className="text-sm font-bold">192.168.1.45</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                   <span className="text-sm font-medium text-white/70">Failed Attempts</span>
                   <span className="text-sm font-bold text-emerald-400">0</span>
                </div>
                <div className="flex items-center justify-between py-2">
                   <span className="text-sm font-medium text-white/70">2FA Status</span>
                   <span className="text-xs font-black uppercase text-orange-400">Disabled</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Columns: Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-50">
              {(["activity", "chats", "details"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? "text-orange-600 bg-orange-50/50 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-orange-500" 
                      : "text-slate-400 hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 p-8">
              {activeTab === "activity" && (
                <div className="space-y-6">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Recent Activity Log</h3>
                      <button 
                        onClick={() => {
                          if (activity.length === 0) {
                            toast.error("No activity to export");
                            return;
                          }
                          // Create CSV content
                          const headers = ["Type", "Time", "Detail", "Status"];
                          const csvContent = [
                            headers.join(","),
                            ...activity.map(item => 
                              `"${item.type}","${item.time}","${item.detail}","${item.status}"`
                            )
                          ].join("\n");

                          // Create blob and download
                          const blob = new Blob([csvContent], { type: "text/csv" });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `activity-log-${user?.name?.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                          toast.success("Activity log exported successfully");
                        }}
                        className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-white hover:bg-orange-500 px-3 py-1 rounded-lg transition-all"
                      >
                        Export Log
                      </button>
                   </div>
                   <div className="space-y-4">
                      {activity.map((item) => (
                        <div key={item.id} className="flex gap-4 group">
                          <div className="flex flex-col items-center">
                             <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all">
                                <Activity className="w-4 h-4 text-slate-400 group-hover:text-white" />
                             </div>
                             <div className="flex-1 w-px bg-slate-100 my-2 last:hidden"></div>
                          </div>
                          <div className="flex-1 pb-6 p-4 rounded-2xl hover:bg-orange-500 group transition-all">
                             <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-slate-800 text-sm group-hover:text-white">{item.type}</p>
                                <span className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-white/60">{item.time}</span>
                             </div>
                             <p className="text-xs text-slate-500 font-medium group-hover:text-white/80">{item.detail}</p>
                             <div className={`inline-block mt-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${statusColors[item.status as keyof typeof statusColors]} group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30`}>
                               {item.status}
                             </div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === "chats" && (
                <div className="space-y-6">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Global Chat Monitoring</h3>
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[8px] font-black uppercase tracking-widest">Supervision Enabled</span>
                   </div>
                   
                   {chatHistory.length === 0 ? (
                      <div className="text-center py-20">
                         <MessageCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                         <p className="text-sm text-slate-400 font-medium">No recorded conversations for this user.</p>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {chatHistory.map((conv) => (
                           <button 
                             key={conv.id}
                             className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-orange-500 transition-all flex flex-col group active:scale-95"
                             onClick={() => setSelectedConv(conv)}
                           >
                              <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold group-hover:bg-white/20 group-hover:text-white">
                                       {conv.participantNames.find(n => n !== user.name)?.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-slate-800 uppercase leading-none mb-1 group-hover:text-white/70">Chat With</p>
                                       <p className="text-sm font-bold text-slate-600 group-hover:text-white">{conv.participantNames.find(n => n !== user.name)}</p>
                                    </div>
                                 </div>
                                 <Eye className="w-4 h-4 text-slate-300 group-hover:text-white" />
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-2 font-medium bg-white p-3 rounded-xl border border-slate-100 group-hover:bg-white/10 group-hover:text-white group-hover:border-transparent transition-all">{conv.lastMessageContent}</p>
                              <div className="mt-4 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/60">
                                 <span>{conv.messages.length} Messages Total</span>
                                 <span>Last: {conv.lastMessageTime}</span>
                              </div>
                           </button>
                         ))}
                      </div>
                   )}

                   {selectedConv && (
                      <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                         <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-200">
                            <div className="flex items-center justify-between mb-10">
                               <div>
                                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Full Chat Audit</h3>
                                  <p className="text-xs font-medium text-slate-400 mt-1">Audit Log ID: {selectedConv.id}</p>
                               </div>
                               <button 
                                 onClick={() => setSelectedConv(null)}
                                 className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                               >
                                  <ChevronRight className="w-5 h-5" />
                               </button>
                            </div>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                               {selectedConv.messages.map((m: ChatMessage) => (
                                 <div key={m.id} className={`flex ${m.senderId === user.id ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] ${m.senderId === user.id ? "order-1" : "order-2"}`}>
                                       <div className="flex items-center gap-2 mb-1 px-1">
                                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{m.senderName} ({m.senderRole})</span>
                                          <span className="text-[8px] font-bold text-slate-300">{m.time}</span>
                                       </div>
                                       <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                                          m.senderId === user.id 
                                             ? "bg-slate-900 text-white rounded-tr-none" 
                                             : "bg-slate-100 text-slate-800 rounded-tl-none"
                                       }`}>
                                          {m.content}
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   )}
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-10">
                   <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">User Permissions Audit</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {[
                           { name: "View Academics", status: true },
                           { name: "Edit Marks", status: user.role === "teacher" || user.role === "Admin" },
                           { name: "Financial Access", status: user.role === "finance" || user.role === "Admin" },
                           { name: "Messaging", status: true },
                           { name: "Portal Admin", status: user.role === "Admin" },
                         ].map((p, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-orange-500 group transition-all">
                             <span className="text-xs font-bold text-slate-700 group-hover:text-white">{p.name}</span>
                             {p.status ? <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-white" /> : <Lock className="w-4 h-4 text-slate-300 group-hover:text-white/60" />}
                           </div>
                         ))}
                      </div>
                   </div>

                   <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Device Log</h3>
                      <div className="bg-slate-900 rounded-[2rem] p-6 text-white/50 text-xs font-mono border border-white/5">
                         <p className="mb-1 text-emerald-400 font-bold">$ last_login_audit {user.id}</p>
                         <p>TIMESTAMP: 2026-04-16T14:30:00Z | IP: 192.168.1.45 | BROWSER: CHROME_MAC</p>
                         <p>TIMESTAMP: 2026-04-15T09:12:00Z | IP: 41.212.45.10 | BROWSER: SAFARI_IOS</p>
                         <p>TIMESTAMP: 2026-04-14T11:45:00Z | IP: 41.212.45.10 | BROWSER: CHROME_WIN</p>
                         <p className="mt-2 text-white/50 animate-pulse text-[10px]">Auditing secure nodes...</p>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
