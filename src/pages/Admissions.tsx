import { useState } from "react";
import { initialAdmissions, type AdmissionLead } from "@/data/demoData";
import { Trash2 } from "lucide-react";

const stages: AdmissionLead["stage"][] = ["Inquiry", "Assessment", "Approved", "Enrolled", "Rejected"];

export default function Admissions() {
  const [leads, setLeads] = useState<AdmissionLead[]>(initialAdmissions);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [stage, setStage] = useState<AdmissionLead["stage"]>("Inquiry");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setLeads((prev) => [...prev, { id: Date.now(), name, contact, stage, date: new Date().toISOString().split("T")[0] }]);
    setName(""); setContact(""); setStage("Inquiry");
  };

  const updateStage = (id: number, newStage: AdmissionLead["stage"]) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage: newStage } : l)));
  };

  const stageColor = (s: AdmissionLead["stage"]) => {
    switch (s) {
      case "Inquiry": return "bg-info/20 text-info";
      case "Assessment": return "bg-warning/20 text-warning";
      case "Approved": return "bg-success/20 text-success";
      case "Enrolled": return "bg-primary/20 text-primary";
      case "Rejected": return "bg-destructive/20 text-destructive";
    }
  };

  const inputClass = "w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Admission Pipeline</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Add Admission Lead</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            <input placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} className={inputClass} />
            <select value={stage} onChange={(e) => setStage(e.target.value as AdmissionLead["stage"])} className={inputClass}>
              {stages.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90">Add Lead</button>
          </form>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 overflow-auto">
          <h3 className="text-sm font-semibold mb-4">Admission Leads ({leads.length})</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-2">Name</th>
                <th className="text-left py-2 px-2">Contact</th>
                <th className="text-left py-2 px-2">Stage</th>
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-border">
                  <td className="py-2 px-2">{l.name}</td>
                  <td className="py-2 px-2">{l.contact}</td>
                  <td className="py-2 px-2">
                    <select
                      value={l.stage}
                      onChange={(e) => updateStage(l.id, e.target.value as AdmissionLead["stage"])}
                      className={`text-xs px-2 py-0.5 rounded border-0 ${stageColor(l.stage)} bg-opacity-20`}
                    >
                      {stages.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-2 px-2 text-muted-foreground">{l.date}</td>
                  <td className="py-2 px-2">
                    <button onClick={() => setLeads((p) => p.filter((x) => x.id !== l.id))} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
