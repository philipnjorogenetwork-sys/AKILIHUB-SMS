import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE = getApiBaseUrl();

const DEFAULT_AUTH = {
  email: import.meta.env.VITE_BACKEND_EMAIL || "admin@akilihub.com",
  password: import.meta.env.VITE_BACKEND_PASSWORD || "admin123",
};

async function authenticateBackend() {
  const cached = localStorage.getItem("backend-auth-token");
  if (cached) {
    return cached;
  }

  const response = await fetch(`${API_BASE.replace(/\/api$/, "")}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(DEFAULT_AUTH),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.token) {
    throw new Error(data?.message || "Unable to authenticate with backend");
  }

  localStorage.setItem("backend-auth-token", data.token);
  return data.token;
}

async function apiRequest(path: string, init: RequestInit = {}) {
  const token = await authenticateBackend();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}

export async function createStudent(payload: Record<string, unknown>) {
  return apiRequest("/v1/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createUser(payload: Record<string, unknown>) {
  return apiRequest("/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createCredential(payload: Record<string, unknown>) {
  return apiRequest("/v1/credentials/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUser(id: string | number, payload: Record<string, unknown>) {
  return apiRequest(`/v1/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
