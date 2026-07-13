export interface CredentialRequest {
  personId: string;
  email: string;
  name: string;
  role: "admin" | "teacher" | "student" | "parent" | "finance" | "secretary";
  enrollmentType?: "system" | "enrolled"; // Track if from enrollment or system
}

export interface CredentialResponse {
  id: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student" | "parent" | "finance" | "secretary";
  personId: string;
  name: string;
  createdAt: string;
  success: boolean;
  message: string;
}

export interface BulkCredentialRequest {
  personIds: string[];
  role?: "admin" | "teacher" | "student" | "parent" | "finance" | "secretary";
}

export interface BulkCredentialResponse {
  total: number;
  successful: number;
  failed: number;
  credentials: CredentialResponse[];
  errors?: Array<{ personId: string; error: string }>;
}
