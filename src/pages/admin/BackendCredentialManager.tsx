import { useState, useMemo } from "react";
import { teachers, students, parents, type UserRole } from "@/data/schoolData";
import { CredentialAPI } from "@/services/CredentialAPI";
import { Key, UserPlus, Copy, Eye, EyeOff, Search, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createCredential } from "@/services/backendSync";

interface GeneratedCredential {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  personId: string;
  name: string;
  createdAt: string;
}

export default function BackendCredentialManager() {
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredential[]>([]);
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"batch" | "results">("batch");

  // Combine all people from system
  const allPeople = useMemo(() => [
    ...teachers.map(t => ({ id: t.id, name: t.name, email: t.email, role: "teacher" as UserRole })),
    ...students.map(s => ({ id: s.id, name: s.name, email: s.email, role: "student" as UserRole })),
    ...parents.map(p => ({ id: p.id, name: p.name, email: p.email, role: "parent" as UserRole })),
  ], []);

  const filteredPeople = useMemo(() => {
    return allPeople.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "all" || p.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [allPeople, searchTerm, selectedRole]);

  const toggleSelection = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const toggleShowPassword = (email: string) => {
    setShowPasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(email)) {
        newSet.delete(email);
      } else {
        newSet.add(email);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleGenerateCredentials = async () => {
    if (selectedPeople.length === 0) {
      toast.error("Please select at least one person");
      return;
    }

    setIsGenerating(true);
    const selectedUsers = allPeople.filter(p => selectedPeople.includes(p.id));

    const credentialsToGenerate = selectedUsers.map(user => ({
      personId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }));

    try {
      const response = await CredentialAPI.generateBulkCredentials(credentialsToGenerate);

      if (response.success && response.data.data?.credentials) {
        for (const credential of credentialsToGenerate) {
          await createCredential({
            personId: credential.personId,
            email: credential.email,
            name: credential.name,
            role: credential.role,
          });
        }

        setGeneratedCredentials(response.data.data.credentials);
        setActiveTab("results");
        toast.success(
          `Generated ${response.data.data.successful} credential${response.data.data.successful !== 1 ? "s" : ""} successfully!`
        );
        setSelectedPeople([]);
      } else {
        toast.error(response.data.message || "Failed to generate credentials");
      }
    } catch (error) {
      toast.error("An error occurred while generating credentials");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedPeople.length === filteredPeople.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(filteredPeople.map(p => p.id));
    }
  };

  const selectAllVisible = selectedPeople.length === filteredPeople.length && filteredPeople.length > 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Key className="w-8 h-8 text-orange-500" />
          Backend Credential Manager
        </h1>
        <p className="text-muted-foreground">Generate and manage user credentials through the backend system. Credentials generated here will be synced with the frontend.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("batch")}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === "batch" 
              ? "border-orange-500 text-orange-500" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Generate Credentials ({selectedPeople.length} selected)
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === "results" 
              ? "border-orange-500 text-orange-500" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Generated Credentials ({generatedCredentials.length})
        </button>
      </div>

      {/* Batch Generation Tab */}
      {activeTab === "batch" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
            >
              <option value="all">All Roles</option>
              <option value="teacher">Teachers</option>
              <option value="student">Students</option>
              <option value="parent">Parents</option>
            </select>
            <button
              onClick={handleSelectAll}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectAllVisible
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {selectAllVisible ? "Deselect All" : "Select All"}
            </button>
          </div>

          {/* People Selection List */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {filteredPeople.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredPeople.map((person) => (
                    <label
                      key={person.id}
                      className="flex items-center gap-4 p-4 hover:bg-secondary/20 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPeople.includes(person.id)}
                        onChange={() => toggleSelection(person.id)}
                        className="w-5 h-5 rounded border-2 border-border cursor-pointer accent-orange-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{person.name}</p>
                        <p className="text-sm text-muted-foreground">{person.email}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-secondary text-xs font-semibold uppercase text-muted-foreground">
                        {person.role}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No people found matching your search
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateCredentials}
            disabled={isGenerating || selectedPeople.length === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Generating {selectedPeople.length} Credential{selectedPeople.length !== 1 ? "s" : ""}...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Generate {selectedPeople.length > 0 ? `${selectedPeople.length} Credential${selectedPeople.length !== 1 ? "s" : ""}` : "Credentials"}
              </>
            )}
          </button>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === "results" && (
        <div className="space-y-6">
          {generatedCredentials.length > 0 ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Success!</p>
                  <p className="text-sm text-green-800">{generatedCredentials.length} credentials have been generated and are now available in the system.</p>
                </div>
              </div>

              {/* Credentials Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {generatedCredentials.map((cred) => (
                        <tr key={cred.email} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground">{cred.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{cred.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-full bg-secondary text-xs font-semibold uppercase">
                              {cred.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <span>
                                {showPasswords.has(cred.email) ? cred.password : "••••••"}
                              </span>
                              <button
                                onClick={() => toggleShowPassword(cred.email)}
                                className="p-1 hover:bg-secondary rounded transition-colors"
                              >
                                {showPasswords.has(cred.email) ? (
                                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => copyToClipboard(cred.password, "Password")}
                              className="flex items-center gap-2 px-3 py-1 bg-secondary hover:bg-secondary/80 rounded text-sm font-semibold transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                              Copy
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Export/Share Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                  <strong>💡 Tip:</strong> These credentials are now synced with the frontend system. Users can log in immediately with these credentials. Share passwords securely with users.
                </p>
              </div>

              <button
                onClick={() => {
                  setGeneratedCredentials([]);
                  setActiveTab("batch");
                }}
                className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-3 rounded-lg transition-colors"
              >
                Generate More Credentials
              </button>
            </>
          ) : (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No credentials generated yet. Go to the <strong>"Generate Credentials"</strong> tab to create some.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
