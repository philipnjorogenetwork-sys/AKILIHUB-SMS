import { useState } from "react";
import { schoolInfo } from "@/data/schoolData";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState([
    { key: "school_name", label: "School Name", value: schoolInfo.name },
    { key: "motto", label: "School Motto", value: schoolInfo.motto },
    { key: "academic_year", label: "Academic Year", value: schoolInfo.academicYear },
    { key: "term", label: "Current Term", value: schoolInfo.term },
    { key: "fee_per_term", label: "Fee Per Term (KSh)", value: "50000" },
    { key: "mpesa_paybill", label: "M-Pesa Paybill", value: "174379" },
    { key: "whatsapp_enabled", label: "WhatsApp Notifications", value: "true" },
    { key: "grading_system", label: "Grading System", value: "KCSE" },
  ]);
  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold">System Settings</h2>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        {settings.map((s, i) => (
          <div key={s.key}>
            <label className="block text-sm font-medium mb-1.5">{s.label}</label>
            <input value={s.value} onChange={e => { const next = [...settings]; next[i] = { ...next[i], value: e.target.value }; setSettings(next); }} className={inputCls} />
          </div>
        ))}
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90"><Save className="h-4 w-4" />Save Settings</button>
      </div>
    </div>
  );
}
