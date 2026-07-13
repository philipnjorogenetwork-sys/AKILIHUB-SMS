import { useState } from "react";
import { useNotificationHelpers, academicNotifications, financeNotifications, systemNotifications } from "@/services/NotificationHelpers";
import { Bell, Send } from "lucide-react";

/**
 * Test Notification Component
 * Use this component to test and demonstrate the notification system
 * 
 * This is a development/testing component - remove from production
 */
export function NotificationTestPanel() {
  const { sendAlert, sendSuccess, sendWarning, sendError } = useNotificationHelpers();
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const handleTestNotification = (notificationType: "info" | "success" | "warning" | "error", message: string) => {
    switch (notificationType) {
      case "success":
        sendSuccess(message);
        break;
      case "warning":
        sendWarning(message);
        break;
      case "error":
        sendError(message);
        break;
      default:
        sendAlert(message);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors shadow-lg"
      >
        <Bell className="w-4 h-4" />
        Test Notifications
      </button>

      {/* Test Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-card border border-border rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4 text-foreground">Notification Tests</h3>

          {/* Custom Message */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Custom Message
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter custom message..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm"
              />
              <button
                onClick={() => {
                  if (customMessage) {
                    handleTestNotification("info", customMessage);
                    setCustomMessage("");
                  }
                }}
                className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-muted-foreground">Quick Tests:</p>

            {/* Info Notifications */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Info (Blue)</p>
              <button
                onClick={() => handleTestNotification("info", "This is an informational notification")}
                className="w-full px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-medium transition-colors"
              >
                Test Info
              </button>
            </div>

            {/* Success Notifications */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Success (Green)</p>
              <button
                onClick={() => handleTestNotification("success", "Operation completed successfully!")}
                className="w-full px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-900 text-xs font-medium transition-colors"
              >
                Test Success
              </button>
            </div>

            {/* Warning Notifications */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Warning (Yellow)</p>
              <button
                onClick={() => handleTestNotification("warning", "This is a warning notification")}
                className="w-full px-3 py-1.5 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-900 text-xs font-medium transition-colors"
              >
                Test Warning
              </button>
            </div>

            {/* Error Notifications */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Error (Red)</p>
              <button
                onClick={() => handleTestNotification("error", "An error occurred")}
                className="w-full px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 text-xs font-medium transition-colors"
              >
                Test Error
              </button>
            </div>
          </div>

          {/* Academic Templates */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-muted-foreground">Academic Templates:</p>
            <button
              onClick={() => handleTestNotification("success", academicNotifications.assignmentPosted("Algebra 101", "Math Homework"))}
              className="w-full px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-medium transition-colors"
            >
              Assignment Posted
            </button>
            <button
              onClick={() => handleTestNotification("success", academicNotifications.gradePosted("Kevin Kamau", "Mathematics", "A"))}
              className="w-full px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-medium transition-colors"
            >
              Grade Posted
            </button>
            <button
              onClick={() => handleTestNotification("warning", academicNotifications.attendanceLow("Kevin Kamau", 75))}
              className="w-full px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-medium transition-colors"
            >
              Low Attendance Alert
            </button>
            <button
              onClick={() => handleTestNotification("info", academicNotifications.examScheduled("KCSE Maths", "April 25, 2026"))}
              className="w-full px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-medium transition-colors"
            >
              Exam Scheduled
            </button>
          </div>

          {/* Finance Templates */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-muted-foreground">Finance Templates:</p>
            <button
              onClick={() => handleTestNotification("warning", financeNotifications.feePaymentDue(15000, "April 30, 2026"))}
              className="w-full px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition-colors"
            >
              Fee Payment Due
            </button>
            <button
              onClick={() => handleTestNotification("error", financeNotifications.feeOverdue(15000, "April 15, 2026"))}
              className="w-full px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition-colors"
            >
              Fee Overdue
            </button>
            <button
              onClick={() => handleTestNotification("success", financeNotifications.paymentReceived(15000, "RCP2026001"))}
              className="w-full px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition-colors"
            >
              Payment Received
            </button>
          </div>

          {/* System Templates */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">System Templates:</p>
            <button
              onClick={() => handleTestNotification("success", systemNotifications.loginSuccess("Kevin Kamau", "2:30 PM"))}
              className="w-full px-3 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-medium transition-colors"
            >
              Login Success
            </button>
            <button
              onClick={() => handleTestNotification("success", systemNotifications.passwordChanged())}
              className="w-full px-3 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-medium transition-colors"
            >
              Password Changed
            </button>
            <button
              onClick={() => handleTestNotification("success", systemNotifications.settingsUpdated("Notification Preferences"))}
              className="w-full px-3 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-medium transition-colors"
            >
              Settings Updated
            </button>
            <button
              onClick={() => handleTestNotification("success", systemNotifications.dataBackupCompleted("2:45 PM"))}
              className="w-full px-3 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-medium transition-colors"
            >
              Backup Completed
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground mt-4 italic">
            💡 This panel is for testing. Check browser console for delivery method logs.
          </p>
        </div>
      )}
    </div>
  );
}
