import { useState } from "react";
import { initialSettings, type SystemSetting } from "@/data/demoData";
import { Save, Trash2, Plus } from "lucide-react";

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>(initialSettings);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    const existing = settings.find((s) => s.key === key);
    if (existing) {
      setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
    } else {
      setSettings((prev) => [...prev, { id: Date.now(), key, value }]);
    }
    setKey(""); setValue("");
  };

  const handleUpdate = (id: number, newValue: string) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, value: newValue } : s)));
  };

  const inputClass = "w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">System Settings / Integrations</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Add / Update Setting</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <input placeholder="Setting Key" value={key} onChange={(e) => setKey(e.target.value)} className={inputClass} />
            <input placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
            <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> Save Setting
            </button>
          </form>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 overflow-auto">
          <h3 className="text-sm font-semibold mb-4">Current Settings</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-2">Key</th>
                <th className="text-left py-2 px-2">Value</th>
                <th className="text-left py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((s) => (
                <tr key={s.id} className="border-b border-border">
                  <td className="py-2 px-2 font-mono text-xs text-muted-foreground">{s.key}</td>
                  <td className="py-2 px-2">
                    <input
                      value={s.value}
                      onChange={(e) => handleUpdate(s.id, e.target.value)}
                      className="bg-secondary border border-border rounded px-2 py-1 text-sm text-foreground w-full"
                    />
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    <button onClick={() => setSettings((p) => p.filter((x) => x.id !== s.id))} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
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
