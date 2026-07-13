import { CredentialResponse, BulkCredentialResponse } from "@/types/credential";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE = getApiBaseUrl();

/**
 * Frontend service for communicating with backend credential API
 */
export const CredentialAPI = {
  /**
   * Generate credentials for a single user
   */
  async generateCredential(personId: string, email: string, name: string, role: string) {
    try {
      const response = await fetch(`${API_BASE}/credentials/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId, email, name, role }),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return {
        success: false,
        data: { error: error instanceof Error ? error.message : "Network error" },
      };
    }
  },

  /**
   * Generate credentials for multiple users
   */
  async generateBulkCredentials(
    credentials: Array<{ personId: string; email: string; name: string; role: string }>
  ) {
    try {
      const response = await fetch(`${API_BASE}/credentials/generate-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials }),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return {
        success: false,
        data: { error: error instanceof Error ? error.message : "Network error" },
      };
    }
  },

  /**
   * Get all generated credentials
   */
  async getAllCredentials() {
    try {
      const response = await fetch(`${API_BASE}/credentials`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return {
        success: false,
        data: { error: error instanceof Error ? error.message : "Network error" },
      };
    }
  },

  /**
   * Get credential by email
   */
  async getCredentialByEmail(email: string) {
    try {
      const response = await fetch(`${API_BASE}/credentials/email/${encodeURIComponent(email)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return {
        success: false,
        data: { error: error instanceof Error ? error.message : "Network error" },
      };
    }
  },

  /**
   * Get credentials by role
   */
  async getCredentialsByRole(role: string) {
    try {
      const response = await fetch(`${API_BASE}/credentials/role/${role}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return {
        success: false,
        data: { error: error instanceof Error ? error.message : "Network error" },
      };
    }
  },

  /**
   * Delete/revoke credentials
   */
  async deleteCredential(email: string) {
    try {
      const response = await fetch(
        `${API_BASE}/credentials/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return {
        success: false,
        data: { error: error instanceof Error ? error.message : "Network error" },
      };
    }
  },

  /**
   * Reset all credentials (development only)
   */
  async resetCredentials() {
    try {
      const response = await fetch(`${API_BASE}/credentials/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return {
        success: false,
        data: { error: error instanceof Error ? error.message : "Network error" },
      };
    }
  },
};
