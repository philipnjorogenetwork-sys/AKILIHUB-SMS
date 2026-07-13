# Live Notification System - Setup & Usage Guide

## Overview

The Akili Hub SMS application now has a complete **live notification system** that supports:
- **Push notifications** (in-app browser notifications)
- **Email notifications** (SMTP integration ready)
- **SMS notifications** (Twilio/similar integration ready)
- **WhatsApp notifications** (WhatsApp Cloud API integration ready)
- **Persistent preferences** (localStorage-based)
- **Real-time notification delivery** (context-based, no page refresh needed)

## Architecture

### Components

1. **NotificationContext** (`src/contexts/NotificationContext.tsx`)
   - Manages notification state globally
   - Stores user preferences in localStorage
   - Provides functions to send and manage notifications

2. **NotificationService** (`src/services/NotificationService.ts`)
   - Handles actual delivery via different channels
   - Email (SMTP)
   - SMS (Twilio)
   - WhatsApp Cloud API
   - Browser Push Notifications

3. **NotificationHelpers** (`src/services/NotificationHelpers.ts`)
   - Convenient hooks and utility functions
   - Pre-defined notification templates for common scenarios
   - Easy-to-use helper functions for components

4. **AccountSettings** (updated)
   - User-facing preference management
   - 8 preference toggles for fine-grained control
   - Auto-saves to localStorage

## Notification Preferences

Users can control notifications via Settings page:

```
✓ Email Notifications       - Receive updates via email
✓ SMS Notifications         - Receive updates via text message
✓ Push Notifications        - Receive browser notifications
✓ Weekly Reports            - Receive weekly summary reports
✓ Attendance Alerts         - Get notified about attendance issues
✓ Fee Reminders             - Get notified about fee payments
✓ Assignment Deadlines      - Get notified about upcoming assignments
✓ Grade Notifications       - Get notified when grades are posted
```

## How to Use in Components

### Method 1: Using the Hook

```tsx
import { useNotificationHelpers } from "@/services/NotificationHelpers";

export function MyComponent() {
  const { sendSuccess, sendWarning, sendError } = useNotificationHelpers();
  
  const handleSave = async () => {
    try {
      // ... do something
      sendSuccess("Changes saved successfully!");
    } catch (error) {
      sendError("Failed to save changes");
    }
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

### Method 2: Using the Context Directly

```tsx
import { useNotifications } from "@/contexts/NotificationContext";

export function AnotherComponent() {
  const { sendNotification, preferences } = useNotifications();
  
  useEffect(() => {
    if (preferences.attendanceAlerts) {
      sendNotification("Attendance below 85%", "warning", "student");
    }
  }, []);
  
  return <div>...</div>;
}
```

### Method 3: Using Pre-defined Templates

```tsx
import { useNotificationHelpers } from "@/services/NotificationHelpers";
import { academicNotifications, financeNotifications } from "@/services/NotificationHelpers";

export function GradeManager() {
  const { sendSuccess } = useNotificationHelpers();
  
  const postGrade = () => {
    const message = academicNotifications.gradePosted("Kevin Kamau", "Math", "A");
    sendSuccess(message, "student", "S001");
  };
  
  return <button onClick={postGrade}>Post Grade</button>;
}
```

## Integration with External Services

### Email (SMTP)

Update `src/services/NotificationService.ts`:

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const NotificationService = {
  sendEmail: async (to: string, subject: string, body: string) => {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to,
      subject,
      html: body,
    });
  },
  // ...
};
```

### SMS (Twilio)

```typescript
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const NotificationService = {
  sendSMS: async (phone: string, message: string) => {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  },
  // ...
};
```

### WhatsApp Cloud API

```typescript
export const NotificationService = {
  sendWhatsApp: async (phone: string, message: string) => {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone.replace('+', ''),
          type: 'text',
          text: { body: message },
        }),
      }
    );
    return await response.json();
  },
  // ...
};
```

## Testing Notifications

### In-App Testing

1. Navigate to **Settings** (from top-right menu)
2. Enable desired notification channels
3. Click "Save Preferences"
4. Trigger notifications through actions:
   - Save profile changes
   - Submit assignments
   - Post grades
   - Receive fee reminders

### Browser Push Notifications

When a push notification is triggered:
1. Browser asks for permission (first time)
2. Click "Allow"
3. Notifications appear in system tray

## Notification Flow

```
User Action (e.g., grade posted)
    ↓
Component calls sendNotification()
    ↓
NotificationContext evaluates preferences
    ↓
Determines delivery methods (email, sms, push, whatsapp)
    ↓
NotificationService sends via selected channels
    ↓
In-app notification displayed immediately
    ↓
External notifications sent asynchronously
```

## Database Schema (for backend integration)

```sql
-- Notification preferences table
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT true,
  attendance_alerts BOOLEAN DEFAULT true,
  fee_reminders BOOLEAN DEFAULT true,
  assignment_deadlines BOOLEAN DEFAULT true,
  grade_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification history table
CREATE TABLE notification_history (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  type VARCHAR(20), -- 'info', 'warning', 'success', 'error'
  delivery_methods TEXT[], -- ARRAY['email', 'sms', 'push']
  status VARCHAR(50), -- 'pending', 'sent', 'failed'
  created_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP
);
```

## Current Status

✅ **Completed:**
- NotificationContext with state management
- Preference storage in localStorage
- UI for preference management in Settings
- Real-time in-app notifications
- Pre-defined notification templates
- NotificationService with multi-channel support
- Integration with SMSLayout header

⏳ **Ready for Backend Integration:**
- Email delivery (SMTP)
- SMS delivery (Twilio)
- WhatsApp delivery
- Notification history logging
- Scheduled notifications
- Notification rules engine

## Security Considerations

1. **Preference Privacy:** User preferences stored in localStorage (client-side). For sensitive data, implement server-side preference storage.

2. **API Credentials:** External service credentials (SMTP, Twilio, WhatsApp) should be environment variables, never hardcoded.

3. **Rate Limiting:** Implement rate limiting to prevent notification spam.

4. **Validation:** Always validate user data before sending notifications.

## Troubleshooting

**Notifications not appearing?**
- Check browser console for errors
- Verify notification preferences are enabled
- Check browser notification permissions

**Can't test push notifications?**
- Ensure HTTPS (required for service workers)
- Grant notification permission when prompted
- Check that `Notification.permission === "granted"`

## Next Steps

1. Connect to backend API for persistent preference storage
2. Integrate with SMTP server for email delivery
3. Configure Twilio account for SMS delivery
4. Set up WhatsApp Cloud API integration
5. Implement notification scheduling (cron jobs)
6. Add notification analytics and logging
