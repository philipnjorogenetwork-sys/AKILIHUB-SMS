# Credential Generation System - Admin Guide

## Overview
The Credential Generator is a secure system that allows administrators to generate and manage login credentials for all school members (students, teachers, and parents). Generated credentials work immediately with the school's login system.

## Accessing the Feature

### From Admin Dashboard
1. Navigate to the **Admin Portal** after logging in
2. Click on **"Credential Generator"** in the left sidebar menu (Key icon)
3. Alternatively, access directly at: `/Admin/credentials`

## How to Generate Credentials

### Step 1: Search or Filter Users
- **Search by Name**: Type a user's name in the search field
- **Search by Email**: Type an email address to find a specific user
- **Filter by Role**: Select from dropdown:
  - All Roles
  - Teachers
  - Students
  - Parents

### Step 2: Generate Credentials
1. Find the user in the list
2. Click the **"Generate"** button (orange button with "+" icon)
3. A success notification will appear with:
   - User's email
   - Temporary password
   - Duration: notification shown for 10 seconds

### Step 3: Distribute Credentials
Once credentials are generated:
- Email the credentials to the user securely
- Credentials appear in the list as "Active"
- User can log in immediately using their email and generated password

## Credential Details

### Password Format
- Generated passwords follow pattern: `{role}{random 3-digit number}`
- Examples:
  - `teacher347` (for teachers)
  - `student892` (for students)
  - `parent156` (for parents)

### Credential Storage
- Credentials are stored in the application's authentication system
- Once generated, credentials are immediately valid
- Passwords are displayed in the notification alert during generation
- Credentials persist and remain valid until manually changed

## User Account Status

### Status Indicators
- **Active**: User has been assigned login credentials
  - Shows the password in the account details
- **No Account**: User has not been assigned credentials yet
  - "Generate" button is available

## Security Considerations

✓ **Each user gets unique credentials**
✓ **Passwords are randomly generated** (no manual guessing)
✓ **Credentials tied to email addresses** (preventing unauthorized access)
✓ **Admin-only access** (only administrators can generate credentials)
✓ **Immediate validation** (credentials work right after generation)

## Testing Credentials

### To Verify Credentials Work:
1. Log out from the admin account
2. Go to Login page
3. Click on appropriate portal (Student, Teacher, Parent)
4. Enter the generated email
5. Enter the generated password
6. Click "Login"
7. User should be logged in successfully

### Demo Test Credentials
Pre-generated accounts for testing:
- **Admin**: Admin@school.com / Admin123
- **Student**: kevin.k@student.com / student123
- **Parent**: joseph.k@email.com / parent123
- **Teacher**: james@school.com / teacher123
- **Finance**: moses@gmail.com / moses123
- **Secretary**: njoroge@gmail.com / sec123

## Troubleshooting

### Issue: "Account already exists for this user"
- **Cause**: Credentials for this user have already been generated
- **Solution**: User already has login credentials. Display existing password from "Active" status.

### Issue: User can't log in with generated credentials
- **Cause**: Possible typo in email or password entry
- **Solution**: 
  1. Go back to Credential Generator
  2. Verify the credentials shown for that user
  3. Redistribute the correct credentials

### Issue: Can't find a user in the list
- **Cause**: User may not be registered in the system
- **Solution**: 
  1. First add the user to the system (Students, Teachers, or Parents)
  2. Then generate credentials for them

## Features & Benefits

✅ **Efficient Bulk Management**: Filter and manage multiple users at once
✅ **No Manual Entry**: Eliminates human error in password assignment
✅ **Immediate Access**: Users can log in immediately after credential generation
✅ **Audit Trail**: See which users have active accounts (visually indicated)
✅ **Role-Based**: Different credential generation for different user types
✅ **Search Capability**: Quickly locate specific users by name or email

## Video Walkthrough (Step-by-Step)

1. **Login** → Admin Portal
2. **Navigate** → Click "Credential Generator" in sidebar
3. **Search** → Type user name or email (optional)
4. **Filter** → Select user role (optional)
5. **Generate** → Click "Generate" button
6. **Copy** → Note the email and password from notification
7. **Distribute** → Send credentials to user
8. **Verify** → User can now log in using those credentials

## Next Steps for Users

Once credentials are generated and distributed:
1. User logs in with their email and temporary password
2. User accesses their respective portal (Student/Teacher/Parent)
3. User can change password in their account settings (if available)
4. Admin can track user activity through audit logs

## System Architecture

The credential generation system integrates with:
- **AuthContext**: Stores and manages user accounts
- **schoolData.ts**: Contains user database (students, teachers, parents)
- **Login Page**: Validates credentials against authentication system

All components work together to ensure credentials are:
- ✓ Generated correctly
- ✓ Stored securely
- ✓ Immediately functional
- ✓ Accessible only to authorized users

---

**Last Updated**: April 16, 2026  
**Version**: 1.0  
**Support**: Contact your system administrator for issues
