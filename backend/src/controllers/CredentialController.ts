import { Request, Response } from "express";
import { CredentialService } from "../services/CredentialService";
import { CredentialRequest, BulkCredentialRequest } from "../models/Credential";

export class CredentialController {
  /**
   * Generate credentials for a single user
   * POST /api/credentials/generate
   * Body: { personId, email, name, role }
   */
  static generateCredential(req: Request, res: Response) {
    try {
      const { personId, email, name, role } = req.body;

      // Validation
      if (!personId || !email || !name || !role) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: personId, email, name, role",
        });
      }

      const credentialRequest: CredentialRequest = {
        personId,
        email,
        name,
        role,
        enrollmentType: "system",
      };

      const credential = CredentialService.generateCredential(credentialRequest);

      return res.status(200).json({
        success: credential.success,
        message: credential.message,
        data: credential,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Generate credentials for multiple users
   * POST /api/credentials/generate-bulk
   * Body: { personIds: [array], role?: string }
   */
  static generateBulkCredentials(req: Request, res: Response) {
    try {
      const { credentials } = req.body;

      if (!credentials || !Array.isArray(credentials)) {
        return res.status(400).json({
          success: false,
          message: "credentials array is required",
        });
      }

      const credentialRequests: CredentialRequest[] = credentials;
      const result = CredentialService.generateBulkCredentials(credentialRequests);

      return res.status(200).json({
        success: true,
        message: `Generated ${result.successful}/${result.total} credentials`,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get all generated credentials
   * GET /api/credentials
   */
  static getAllCredentials(req: Request, res: Response) {
    try {
      const credentials = CredentialService.getAllCredentials();

      return res.status(200).json({
        success: true,
        message: `Retrieved ${credentials.length} credentials`,
        data: credentials,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get credential by email
   * GET /api/credentials/email/:email
   */
  static getCredentialByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email parameter is required",
        });
      }

      const credential = CredentialService.getCredentialByEmail(email);

      if (!credential) {
        return res.status(404).json({
          success: false,
          message: `No credentials found for ${email}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Credential retrieved",
        data: credential,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get credentials by role
   * GET /api/credentials/role/:role
   */
  static getCredentialsByRole(req: Request, res: Response) {
    try {
      const { role } = req.params;

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Role parameter is required",
        });
      }

      const credentials = CredentialService.getCredentialsByRole(role);

      return res.status(200).json({
        success: true,
        message: `Retrieved ${credentials.length} credentials for role: ${role}`,
        data: credentials,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Delete credential (revoke)
   * DELETE /api/credentials/:email
   */
  static deleteCredential(req: Request, res: Response) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email parameter is required",
        });
      }

      const deleted = CredentialService.deleteCredential(email);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Credential not found for ${email}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Credentials deleted for ${email}`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Reset all credentials (development only)
   * POST /api/credentials/reset
   */
  static resetCredentials(req: Request, res: Response) {
    try {
      CredentialService.resetCredentials();

      return res.status(200).json({
        success: true,
        message: "All credentials have been reset",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
