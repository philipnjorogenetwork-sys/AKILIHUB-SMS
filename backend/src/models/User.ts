export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: "Admin" | "teacher" | "student" | "parent" | "finance" | "secretary";
  personId: string;
  status: "active" | "inactive";
}

export interface UpdateUserProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}
