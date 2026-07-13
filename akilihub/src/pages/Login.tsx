import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap } from "lucide-react";

const demoAccounts = [
  { role: "Secretary", email: "Secretary@school.com", password: "Secretary123" },
  { role: "Teacher", email: "james@school.com", password: "teacher123" },
  { role: "Student", email: "kevin.k@student.com", password: "student123" },
  { role: "Parent", email: "joseph.k@email.com", password: "parent123" },
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!login(email, password)) {
      setError("Invalid email or password");
    }
  };

  const quickLogin = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    if (!login(em, pw)) setError("Login failed");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Akili Hub Solutions</h1>
          <p className="text-sm text-muted-foreground mt-1">School Management System</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Sign In</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
              <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-red-500" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Sign In</button>
          </form>
        </div>

        <div className="mt-6 bg-card border border-border rounded-xl p-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quick Demo Login</h3>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map(a => (
              <button key={a.role} onClick={() => quickLogin(a.email, a.password)} className="bg-secondary hover:bg-accent border border-border rounded-lg p-3 text-left transition-colors">
                <span className="text-sm font-medium text-foreground block">{a.role}</span>
                <span className="text-xs text-muted-foreground">{a.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
