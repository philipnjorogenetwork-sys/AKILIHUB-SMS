import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { students } from "@/data/schoolData";
import {
  Shield,
  Building2,
  FileText,
  BookOpen,
  Users,
  UserCog,
  DollarSign,
  GraduationCap,
  Lock,
  ArrowLeft,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

/* ─── Static data ─────────────────────────────────────────── */
const features = [
  { icon: Shield,   title: "Role-based Access Control", desc: "Granular permissions per user." },
  { icon: Building2, title: "Multi-school Support",     desc: "Manage multiple campuses."     },
  { icon: FileText,  title: "Secure Academic Reports",  desc: "Encrypted & always available." },
];

type PortalItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  loginTitle: string;
  loginDesc: string;
  email?: string;
  password?: string;
  isStaff?: boolean;
};

const portals: PortalItem[] = [

  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    description: "Academics & Learning Portal",
    loginTitle: "Student Portal",
    loginDesc: "Sign in to access your school's management dashboard.",
    email: "kevin.k@student.com",
    password: "student123",
  },
  {
    id: "parent",
    label: "Parent",
    icon: Users,
    description: "Track your child's progress",
    loginTitle: "Parent Portal",
    loginDesc: "Stay informed and manage your child's academic progress.",
    email: "joseph.k@email.com",
    password: "parent123",
  },
  {
    id: "staff",
    label: "Staff",
    icon: UserCog,
    description: "Admin, Teacher, Finance & Secretary",
    loginTitle: "Staff Portal",
    loginDesc: "",
    isStaff: true,
  },
];

const staffRoles: PortalItem[] = [
  {
    id: "admin",
    label: "Admin",
    icon: Shield,
    description: "System & School Management",
    loginTitle: "Admin Portal",
    loginDesc: "Enter your admin credentials as provided by the system administrator.",
    email: "Admin@school.com",
    password: "Admin123",
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: BookOpen,
    description: "Class management & marks",
    loginTitle: "Teacher Portal",
    loginDesc: "Enter your teacher credentials as provided by the school administrator.",
    email: "james@school.com",
    password: "teacher123",
  },
  {
    id: "finance",
    label: "Finance Controller",
    icon: DollarSign,
    description: "Finance & payments",
    loginTitle: "Finance Controller Portal",
    loginDesc: "Enter your finance controller credentials as provided by the administrator.",
    email: "moses@gmail.com",
    password: "moses123",
  },
  {
    id: "secretary",
    label: "Secretary",
    icon: FileText,
    description: "Admissions & records",
    loginTitle: "Secretary Portal",
    loginDesc: "Enter your secretary credentials as provided by the school administrator.",
    email: "njoroge@gmail.com",
    password: "sec123",
  },
];

/* ─── Component ───────────────────────────────────────────── */
type View = "portals" | "staff-roles" | "credentials";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [view, setView]               = useState<View>("portals");
  const [selectedPortal, setSelected] = useState<PortalItem | null>(null);
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [schoolCode, setSchoolCode]   = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  /* Update browser tab title */
  useEffect(() => {
    document.title = "Akili Hub SMS";
  }, []);

  const openCredentials = (portal: PortalItem) => {
    setSelected(portal);
    setEmail("");
    setPassword("");
    setSchoolCode("");
    setAdmissionNo("");
    setError("");
    setView("credentials");
  };

  const handlePortalClick = (portal: PortalItem) => {
    if (portal.isStaff) {
      setView("staff-roles");
    } else {
      openCredentials(portal);
    }
  };

  const handleBack = () => {
    setError("");
    if (view === "credentials" && selectedPortal && staffRoles.find(r => r.id === selectedPortal.id)) {
      setView("staff-roles");
    } else {
      setView("portals");
      setSelected(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    /* ─── Portal card (shared) ──────────────────── */
    setLoading(true);

    try {
      if (selectedPortal?.id === "student") {
        if (!schoolCode.trim() || !admissionNo.trim()) {
          setError("Students must enter both School Code and Admission Number.");
          setLoading(false);
          return;
        }

        // backend-backed lookup
        const mod = await import("@/services/StudentAuthAPI");
        const result = await mod.lookupStudentBySchoolCodeAndAdmissionNo(schoolCode.trim(), admissionNo.trim());

        if (!result.success || !result.student?.personId) {
          setError(result.message || "No student record matches the provided School Code and Admission Number.");
          setLoading(false);
          return;
        }

        const personId = result.student.personId;

        const studentAccount = auth.getUserByPersonId(personId);
        if (!studentAccount || studentAccount.role !== "student") {
          setError("Student portal access is not configured yet. Please contact your administrator.");
          setLoading(false);
          return;
        }

        if (auth.loginStudent(personId)) {
          navigate("/");
          return;
        }

        setError("Unable to sign in this student. Please contact support.");
        setLoading(false);
        return;
      }

      // Non-student login requires email + password
      const targetUser = auth.getUserByEmail(email);
      if (!targetUser || targetUser.password !== password) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      const portalId = selectedPortal?.id;
      const userRole = targetUser.role;
      let isValidPortal = false;

      if (portalId === "admin" && userRole === "Admin") isValidPortal = true;
      if (portalId === "parent" && userRole === "parent") isValidPortal = true;
      if (portalId === "teacher" && userRole === "teacher") isValidPortal = true;
      if (portalId === "finance" && userRole === "finance") isValidPortal = true;
      if (portalId === "secretary" && userRole === "secretary") isValidPortal = true;

      if (!isValidPortal) {
        setError(
          `Credentials verified, but you are trying to access the ${selectedPortal?.label} portal with a ${userRole} account. Please choose the right portal.`
        );
        setLoading(false);
        return;
      }

      if (auth.login(email, password)) {
        navigate("/");
      } else {
        setError("An unexpected error occurred during login.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("A system error occurred. Please try again later.");
      setLoading(false);
    }
  };

  const PortalCard = ({ portal }: { portal: PortalItem }) => {
    const Icon = portal.icon;
    return (
      <button
        key={portal.id}
        onClick={() => handlePortalClick(portal)}
        style={{ borderRadius: "10px" }}
        className="group flex flex-col items-center justify-center gap-3 px-4 py-6 sm:py-7 bg-white border-2 border-gray-100 text-center transition-all duration-200 hover:!bg-white hover:border-orange-500 hover:shadow-md hover:!text-inherit"
      >
        <div className="w-12 h-12 bg-orange-50 group-hover:bg-orange-100 rounded-2xl flex items-center justify-center transition-colors duration-200">
          <Icon className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{portal.label}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{portal.description}</p>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[3fr_1fr]">

      {/* ══ IMAGE SECTION — 3/4 on large screens ══ */}
      <div
        className="relative hidden lg:flex flex-col overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/AIC-home-page-carasouel-scaled-1024x683.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-r from-transparent to-white pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full px-12 py-12">
          <div className="flex items-center gap-4">
            <img
              src="/favicon.png.png"
              alt="Akili Hub Logo"
              className="w-12 h-12 object-contain rounded-xl shadow-lg border border-white/10"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <span className="text-white text-xl font-extrabold tracking-tight">Akili Hub SMS</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-xl">
            <h2 className="text-5xl font-black text-white leading-tight drop-shadow-2xl">
              Choose your portal with clarity and confidence.
            </h2>
            <p className="mt-5 text-lg text-white/80 max-w-lg leading-relaxed">
              Join institutions who trust Elimu Hub SMS to streamline their daily operatins and drive student success.
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3 mb-4 text-white/80 text-sm">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 border border-white/15">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-white/65">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-xs mt-4">
            © {new Date().getFullYear()} Akili Hub Solutions. All rights reserved.
          </p>
        </div>
      </div>

      {/* ══ WHITE PORTAL CHOICE PANEL — 1/4 on large screens ══ */}
      <div className="w-full bg-white flex items-center justify-center p-6 sm:p-10 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <img src="/favicon.png.png" alt="Logo" className="w-6 h-6 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="text-gray-900 text-base font-bold">Akili Hub SMS</span>
          </div>

          {/* ── VIEW: Portal grid ── */}
          {view === "portals" && (
            <>
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full mb-4">
                  <Lock className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-orange-600 text-xs font-medium">Secure Login</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Select your Portal</h1>
                <p className="text-gray-400 text-sm mt-1">Welcome to Elimu Hub SMS. Select your role to log in to your dashboard.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {portals.map((p) => <PortalCard key={p.id} portal={p} />)}
              </div>

              <p className="text-center text-xs text-gray-400 mt-8">
                Having trouble?{" "}
                <button
                  onClick={() => navigate("/contact")}
                  className="text-orange-500 hover:!text-orange-700 hover:!bg-transparent font-medium underline underline-offset-2 transition-colors"
                >
                  Contact your system administrator.
                </button>
              </p>
            </>
          )}

          {/* ── VIEW: Staff sub-roles ── */}
          {view === "staff-roles" && (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-gray-400 hover:!text-orange-500 hover:!bg-transparent mb-6 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to portals
              </button>

              <div className="mb-7">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                  <UserCog className="w-6 h-6 text-orange-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
                <p className="text-gray-400 text-sm mt-1">Select your staff role to continue</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {staffRoles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => openCredentials(p)}
                    style={{ borderRadius: "10px" }}
                    className="group flex items-center gap-4 px-5 py-4 bg-white border-2 border-gray-100 text-left transition-all duration-200 hover:!bg-white hover:border-orange-500 hover:shadow-md hover:!text-inherit"
                  >
                    <div className="w-10 h-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                      <p.icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{p.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── VIEW: Credentials form ── */}
          {view === "credentials" && selectedPortal && (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-gray-400 hover:!text-orange-500 hover:!bg-transparent mb-6 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to portals
              </button>

              {/* Portal identity */}
              <div className="mb-7">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                  <selectedPortal.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedPortal.loginTitle}</h1>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{selectedPortal.loginDesc}</p>
              </div>

              {error && (
                <div className="border border-orange-200 bg-orange-50 px-4 py-4 rounded-xl mb-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 rounded-full bg-orange-100 text-orange-700">
                      <Lock className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium leading-relaxed text-orange-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}


              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedPortal?.id === "student" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">School Code</label>
                      <input
                        type="text"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        placeholder="Enter your school code"
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Admission Number</label>
                      <input
                        type="text"
                        value={admissionNo}
                        onChange={(e) => setAdmissionNo(e.target.value)}
                        placeholder="Enter your admission number"
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Please ask your teacher/tutor for school code if missing.</p>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:!bg-transparent hover:!border-transparent text-gray-400 hover:!text-gray-600 p-0"
                        >
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:!bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Sign In to {selectedPortal.label} Portal
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                Credentials are generated by your administrator.{" "}
                <button
                  onClick={() => navigate("/contact")}
                  className="text-orange-500 hover:!text-orange-700 hover:!bg-transparent font-medium underline underline-offset-2"
                >
                  Contact support.
                </button>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
