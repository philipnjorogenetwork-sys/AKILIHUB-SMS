import { initialAuditLogs } from "@/data/demoData";
import { useState } from "react";

export default function AuditLogs() {
  const [filter, setFilter] = useState("");
  const logs = filter
    ? initialAuditLogs.filter(
        (l) =>
          l.portal.toLowerCase().includes(filter.toLowerCase()) ||
          l.action.toLowerCase().includes(filter.toLowerCase()) ||
          l.entity.toLowerCase().includes(filter.toLowerCase())
      )
    : initialAuditLogs;

  const actionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-success/20 text-success";
      case "UPDATE": return "bg-warning/20 text-warning";
      case "DELETE": return "bg-destructive/20 text-destructive";
      default: return "bg-info/20 text-info";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Audit Logs</h2>
        <input
          placeholder="Filter logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-secondary border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground w-64 focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <div className="bg-card border border-border rounded-lg p-5 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-2">Portal</th>
              <th className="text-left py-2 px-2">Action</th>
              <th className="text-left py-2 px-2">Entity</th>
              <th className="text-left py-2 px-2">Entity ID</th>
              <th className="text-left py-2 px-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-border">
                <td className="py-2 px-2">{l.portal}</td>
                <td className="py-2 px-2"><span className={`text-xs px-2 py-0.5 rounded ${actionColor(l.action)}`}>{l.action}</span></td>
                <td className="py-2 px-2">{l.entity}</td>
                <td className="py-2 px-2 font-mono text-xs text-muted-foreground">{l.entityId}</td>
                <td className="py-2 px-2 text-muted-foreground">{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
