/**
 * Notification Helper Utilities
 * Use these functions throughout the app to send notifications based on user actions
 */

import { useNotifications } from "@/contexts/NotificationContext";

/**
 * Hook to use notification sending in components
 * Usage: const { sendAlert, sendSuccess, sendWarning, sendError } = useNotificationHelpers();
 */
export function useNotificationHelpers() {
  const { sendNotification } = useNotifications();

  return {
    sendAlert: (message: string, targetRole?: string, targetId?: string) =>
      sendNotification(message, "info", targetRole, targetId),
    
    sendSuccess: (message: string, targetRole?: string, targetId?: string) =>
      sendNotification(message, "success", targetRole, targetId),
    
    sendWarning: (message: string, targetRole?: string, targetId?: string) =>
      sendNotification(message, "warning", targetRole, targetId),
    
    sendError: (message: string, targetRole?: string, targetId?: string) =>
      sendNotification(message, "error", targetRole, targetId),
  };
}

/**
 * Academic notification scenarios
 */
export const academicNotifications = {
  assignmentPosted: (studentId: string, assignmentName: string) =>
    `New assignment: ${assignmentName}`,
  
  gradePosted: (studentName: string, subject: string, grade: string) =>
    `${subject} grade posted: ${grade}`,
  
  attendanceLow: (studentName: string, percentage: number) =>
    `${studentName}'s attendance is ${percentage}% - Below threshold`,
  
  examScheduled: (examName: string, date: string) =>
    `${examName} scheduled for ${date}`,
};

/**
 * Finance notification scenarios
 */
export const financeNotifications = {
  feePaymentDue: (amount: number, dueDate: string) =>
    `Fee payment of KSh ${amount} due by ${dueDate}`,
  
  feeOverdue: (amount: number, overdueDate: string) =>
    `Outstanding fee: KSh ${amount} (Overdue since ${overdueDate})`,
  
  paymentReceived: (amount: number, receiptNo: string) =>
    `Payment of KSh ${amount} received. Receipt: ${receiptNo}`,
  
  invoiceGenerated: (invoiceNo: string, amount: number) =>
    `Invoice ${invoiceNo} generated for KSh ${amount}`,
};

/**
 * System notification scenarios
 */
export const systemNotifications = {
  loginSuccess: (userName: string, time: string) =>
    `Login successful: ${userName} at ${time}`,
  
  passwordChanged: () =>
    `Your password was changed successfully`,
  
  settingsUpdated: (setting: string) =>
    `${setting} settings updated successfully`,
  
  dataBackupCompleted: (timestamp: string) =>
    `System backup completed at ${timestamp}`,
};

/**
 * Broadcast notification to all users of a specific role
 */
export function broadcastToRole(role: string, message: string, type: "info" | "warning" | "success" | "error" = "info") {
  // This would be called from admin/server context
  // to send notifications to all users of a specific role
  return {
    role,
    message,
    type,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Send notification to specific user by ID
 */
export function notifyUser(userId: string, message: string, type: "info" | "warning" | "success" | "error" = "info") {
  return {
    userId,
    message,
    type,
    timestamp: new Date().toISOString(),
  };
}
