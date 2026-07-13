import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { Bell, Mail, Lock, Eye, EyeOff, Save, ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const { preferences, updatePreferences } = useNotifications();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showActiveSessions, setShowActiveSessions] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  if (!user) return null;

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Call backend API to change password
      // const response = await fetch(`/api/users/${user.id}/password`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      // });

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Password changed successfully!", {
        description: "Your password has been updated."
      });
      
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePasswordModal(false);
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsChange = async () => {
    setIsSaving(true);
    try {
      // Preferences are automatically saved to localStorage via updatePreferences
      toast.success("Settings updated successfully!", {
        description: "Your notification preferences have been saved."
      });
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-500" />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) => updatePreferences({ emailNotifications: e.target.checked })}
              className="w-5 h-5 rounded border-border text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">SMS Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates via text message</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.smsNotifications}
              onChange={(e) => updatePreferences({ smsNotifications: e.target.checked })}
              className="w-5 h-5 rounded border-border text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Receive browser notifications</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.pushNotifications}
              onChange={(e) => updatePreferences({ pushNotifications: e.target.checked })}
              className="w-5 h-5 rounded border-border text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
          </div>

          {/* Weekly Reports */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">Weekly Reports</p>
              <p className="text-xs text-muted-foreground">Receive weekly summary reports</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.weeklyReports}
              onChange={(e) => updatePreferences({ weeklyReports: e.target.checked })}
              className="w-5 h-5 rounded border-border text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
          </div>

          {/* Attendance Alerts */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">Attendance Alerts</p>
              <p className="text-xs text-muted-foreground">Get notified about attendance issues</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.attendanceAlerts}
              onChange={(e) => updatePreferences({ attendanceAlerts: e.target.checked })}
              className="w-5 h-5 rounded border-border text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
          </div>

          {/* Fee Reminders */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">Fee Reminders</p>
              <p className="text-xs text-muted-foreground">Get notified about fee payments</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.feeReminders}
              onChange={(e) => updatePreferences({ feeReminders: e.target.checked })}
              className="w-5 h-5 rounded border-border text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
          </div>

          {/* Assignment Deadlines */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">Assignment Deadlines</p>
              <p className="text-xs text-muted-foreground">Get notified about upcoming assignments</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.assignmentDeadlines}
              onChange={(e) => updatePreferences({ assignmentDeadlines: e.target.checked })}
              className="w-5 h-5 rounded border-border text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
          </div>

          {/* Grade Notifications */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">Grade Notifications</p>
              <p className="text-xs text-muted-foreground">Get notified when grades are posted</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.gradeNotifications}
              onChange={(e) => updatePreferences({ gradeNotifications: e.target.checked })}
              className="w-5 h-5 rounded border-border text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
          </div>

          <button
            onClick={handleSettingsChange}
            disabled={isSaving}
            className="mt-6 w-full px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-orange-500" />
          Security
        </h3>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <p className="text-sm font-semibold text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 90 days ago</p>
            </div>
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="px-4 py-2 rounded-lg border border-border hover:bg-background text-foreground text-sm font-semibold transition-colors"
            >
              Change Password
            </button>
          </div>

          {/* Active Sessions */}
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-orange-900">Active Sessions</p>
              <p className="text-xs text-orange-700">Currently logged in on 1 device</p>
            </div>
            <button
              onClick={() => setShowActiveSessions(!showActiveSessions)}
              className="px-4 py-2 rounded-lg border border-orange-300 hover:bg-orange-100 text-orange-900 text-sm font-semibold transition-colors"
            >
              View All
            </button>
          </div>

          {/* Active Sessions Details */}
          {showActiveSessions && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-semibold text-orange-900">Current Session</p>
                  <p className="text-xs text-orange-700 mt-1">Device: Windows PC</p>
                  <p className="text-xs text-orange-700">Browser: Chrome</p>
                  <p className="text-xs text-orange-700">IP Address: 192.168.1.1</p>
                  <p className="text-xs text-orange-700">Last Active: Just now</p>
                </div>
                <button className="text-xs text-orange-600 hover:text-orange-700 font-semibold">
                  Sign Out of All Other Sessions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-red-900 mb-4">Account Actions</h3>
        
        <div className="space-y-3">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-300 hover:bg-red-100 text-red-600 font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-xs text-red-700">
            Tip: Click "Sign Out" to end your session securely.
          </p>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl max-w-md w-full p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Change Password</h3>
            
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-2.5 pr-10 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-2.5 pr-10 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-2.5 pr-10 border border-border rounded-lg bg-secondary focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={handlePasswordChange}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Changing..." : "Change Password"}
                </button>
                <button
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setShowPasswords({ current: false, new: false, confirm: false });
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary text-foreground font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
