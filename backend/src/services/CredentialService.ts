import { CredentialRequest, CredentialResponse } from "../models/Credential";

// In-memory storage for generated credentials
// In production, this would be a database
let generatedCredentials: CredentialResponse[] = [];

export class CredentialService {
  /**
   * Generate a random password based on role
   * Format: role{3-digit random number}
   * Example: teacher847, student123
   */
  static generatePassword(role: string): string {
    const randomDigits = Math.floor(100 + Math.random() * 900);
    return `${role}${randomDigits}`;
  }

  /**
   * Generate credentials for a single person
   */
  static generateCredential(request: CredentialRequest): CredentialResponse {
    const existingCredential = generatedCredentials.find(
      (cred) => cred.email === request.email || cred.personId === request.personId
    );

    if (existingCredential) {
      return {
        ...existingCredential,
        success: false,
        message: `Credentials already exist for ${request.email}`,
      };
    }

    const password = this.generatePassword(request.role);
    const credential: CredentialResponse = {
      id: `U${Math.floor(1000 + Math.random() * 9000)}`,
      email: request.email,
      password,
      role: request.role,
      personId: request.personId,
      name: request.name,
      createdAt: new Date().toISOString(),
      success: true,
      message: `Credentials generated successfully for ${request.name}`,
    };

    // Store the credential
    generatedCredentials.push(credential);

    return credential;
  }

  /**
   * Generate credentials for multiple people
   */
  static generateBulkCredentials(
    requests: CredentialRequest[]
  ): { total: number; successful: number; failed: number; credentials: CredentialResponse[] } {
    const results: CredentialResponse[] = [];
    let successful = 0;
    let failed = 0;

    for (const request of requests) {
      const credential = this.generateCredential(request);
      results.push(credential);

      if (credential.success) {
        successful++;
      } else {
        failed++;
      }
    }

    return {
      total: requests.length,
      successful,
      failed,
      credentials: results,
    };
  }

  /**
   * Get all generated credentials
   */
  static getAllCredentials(): CredentialResponse[] {
    return generatedCredentials;
  }

  /**
   * Get credential by email
   */
  static getCredentialByEmail(email: string): CredentialResponse | undefined {
    return generatedCredentials.find((cred) => cred.email === email);
  }

  /**
   * Get credential by person ID
   */
  static getCredentialByPersonId(personId: string): CredentialResponse | undefined {
    return generatedCredentials.find((cred) => cred.personId === personId);
  }

  /**
   * Get credentials by role
   */
  static getCredentialsByRole(role: string): CredentialResponse[] {
    return generatedCredentials.filter((cred) => cred.role === role);
  }

  /**
   * Delete credential (revoke access)
   */
  static deleteCredential(email: string): boolean {
    const index = generatedCredentials.findIndex((cred) => cred.email === email);
    if (index > -1) {
      generatedCredentials.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Reset all credentials (for development/testing)
   */
  static resetCredentials(): void {
    generatedCredentials = [];
  }

  /**
   * Seed initial credentials (optional)
   */
  static seedCredentials(credentials: CredentialResponse[]): void {
    generatedCredentials = [...credentials];
  }
}
