import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react";

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  attendanceAlerts: boolean;
  feeReminders: boolean;
  assignmentDeadlines: boolean;
  gradeNotifications: boolean;
}

export interface LiveNotification {
  id: string;
  targetRole: string | "all";
  targetId?: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
  deliveryMethods?: ("email" | "sms" | "push")[];
}

interface NotificationContextType {
  preferences: NotificationPreferences;
  notifications: LiveNotification[];
  unreadCount: number;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  addNotification: (notification: Omit<LiveNotification, "id" | "time">) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  sendNotification: (message: string, type: "info" | "warning" | "success" | "error", targetRole?: string, targetId?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  weeklyReports: true,
  attendanceAlerts: true,
  feeReminders: true,
  assignmentDeadlines: true,
  gradeNotifications: true,
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Load preferences from localStorage
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    try {
      const stored = localStorage.getItem("notificationPreferences");
      return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [notifications, setNotifications] = useState<LiveNotification[]>([]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Persist preferences to localStorage
  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...prefs };
      try {
        localStorage.setItem("notificationPreferences", JSON.stringify(updated));
      } catch {
        console.error("Failed to save notification preferences");
      }
      return updated;
    });
  }, []);

  // Add a notification
  const addNotification = useCallback((notification: Omit<LiveNotification, "id" | "time">) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const time = new Date().toLocaleString();
    
    setNotifications(prev => [
      { ...notification, id, time, read: false } as LiveNotification,
      ...prev
    ]);

    // Automatically remove notification after 10 seconds if unread
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id || n.read));
    }, 10000);

    return id;
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  // Clear a notification
  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Send a notification with delivery methods based on preferences
  const sendNotification = useCallback(
    (message: string, type: "info" | "warning" | "success" | "error", targetRole?: string, targetId?: string) => {
      // Determine delivery methods based on preferences
      const deliveryMethods: ("email" | "sms" | "push")[] = [];
      
      if (preferences.emailNotifications) deliveryMethods.push("email");
      if (preferences.smsNotifications) deliveryMethods.push("sms");
      if (preferences.pushNotifications) deliveryMethods.push("push");

      const notifId = addNotification({
        targetRole: targetRole || "all",
        targetId,
        message,
        type,
        read: false,
        deliveryMethods: deliveryMethods.length > 0 ? deliveryMethods : ["push"], // Default to push
      });

      // Simulate sending via delivery methods
      deliveryMethods.forEach(method => {
        console.log(`[${method.toUpperCase()}] Notification: ${message}`);
        // In production, call actual APIs here
      });

      return notifId;
    },
    [preferences, addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        preferences,
        notifications,
        unreadCount,
        updatePreferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
