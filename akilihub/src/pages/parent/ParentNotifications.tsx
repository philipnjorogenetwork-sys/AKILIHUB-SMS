import { useAuth } from "@/contexts/AuthContext";
import { notifications } from "@/data/schoolData";
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const typeIcons = { info: Info, warning: AlertTriangle, success: CheckCircle, error: XCircle };
const typeColors = { info: "text-blue-400", warning: "text-amber-400", success: "text-green-400", error: "text-red-400" };

export default function ParentNotifications() {
  const { user } = useAuth();
  const myNotifs = notifications.filter(n => n.targetRole === "parent" && (!n.targetId || n.targetId === user?.personId));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Notifications</h2>
      {myNotifs.length === 0 ? <p className="text-sm text-muted-foreground">No notifications</p> : (
        <div className="space-y-3">
          {myNotifs.map(n => {
            const Icon = typeIcons[n.type];
            return (
              <div key={n.id} className={`bg-card border border-border rounded-xl p-4 flex items-start gap-3 ${!n.read ? "border-l-2 border-l-primary" : ""}`}>
                <Icon className={`h-5 w-5 mt-0.5 ${typeColors[n.type]}`} />
                <div className="flex-1">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
                {!n.read && <span className="bg-primary h-2 w-2 rounded-full mt-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
