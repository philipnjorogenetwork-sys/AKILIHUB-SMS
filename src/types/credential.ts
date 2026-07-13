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

export interface BulkCredentialResponse {
  total: number;
  successful: number;
  failed: number;
  credentials: CredentialResponse[];
  errors?: Array<{ personId: string; error: string }>;
}
