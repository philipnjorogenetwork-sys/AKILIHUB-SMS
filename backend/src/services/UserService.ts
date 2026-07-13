import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";
import { Logger } from "../middleware/logger";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const logger = new Logger("UserService");

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  personId: string;
  phone?: string;
  address?: string;
  status: "active" | "inactive";
  createdAt?: Date;
  lastLogin?: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role: string;
  personId: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  address?: string;
  status?: "active" | "inactive";
}

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(data: CreateUserDTO): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const result = await executeUpdate(
        `INSERT INTO users (email, password, name, role, person_id, phone, address, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.email,
          hashedPassword,
          data.name,
          data.role,
          data.personId,
          data.phone || null,
          data.address || null,
          "active",
        ]
      );

      const user = await this.getUserById(result.lastInsertId);
      if (!user) {
        throw new Error("Failed to retrieve created user");
      }

      logger.info(`User created: ${data.email}`);
      return user;
    } catch (error) {
      logger.error("Error creating user", { error, email: data.email });
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: number): Promise<User | null> {
    try {
      const user = await executeQueryOne<User>(
        `SELECT id, email, name, role, person_id as personId, phone, address, status, 
                created_at as createdAt, last_login as lastLogin FROM users WHERE id = ?`,
        [id]
      );
      return user || null;
    } catch (error) {
      logger.error("Error fetching user by ID", { error, id });
      throw error;
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await executeQueryOne<User>(
        `SELECT id, email, name, role, person_id as personId, phone, address, status,
                created_at as createdAt, last_login as lastLogin FROM users WHERE email = ?`,
        [email]
      );
      return user || null;
    } catch (error) {
      logger.error("Error fetching user by email", { error, email });
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  static async getAllUsers(
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: User[]; total: number }> {
    try {
      const offset = (page - 1) * limit;

      const users = await executeQuery<User>(
        `SELECT id, email, name, role, person_id as personId, phone, address, status,
                created_at as createdAt, last_login as lastLogin FROM users 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const countResult = await executeQueryOne<{ count: number }>(
        "SELECT COUNT(*) as count FROM users"
      );

      return {
        users,
        total: countResult?.count || 0,
      };
    } catch (error) {
      logger.error("Error fetching all users", { error });
      throw error;
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: string): Promise<User[]> {
    try {
      const users = await executeQuery<User>(
        `SELECT id, email, name, role, person_id as personId, phone, address, status,
                created_at as createdAt, last_login as lastLogin FROM users WHERE role = ?`,
        [role]
      );
      return users;
    } catch (error) {
      logger.error("Error fetching users by role", { error, role });
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(id: number, data: UpdateUserDTO): Promise<User> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.name) {
        updates.push("name = ?");
        values.push(data.name);
      }
      if (data.phone !== undefined) {
        updates.push("phone = ?");
        values.push(data.phone);
      }
      if (data.address !== undefined) {
        updates.push("address = ?");
        values.push(data.address);
      }
      if (data.status) {
        updates.push("status = ?");
        values.push(data.status);
      }

      if (updates.length === 0) {
        return this.getUserById(id) as Promise<User>;
      }

      updates.push("updated_at = NOW()");
      values.push(id);

      await executeUpdate(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        values
      );

      const user = await this.getUserById(id);
      if (!user) {
        throw new Error("User not found after update");
      }

      logger.info(`User updated: ${id}`);
      return user;
    } catch (error) {
      logger.error("Error updating user", { error, id });
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await executeQueryOne<{ password: string }>(
        "SELECT password FROM users WHERE id = ?",
        [id]
      );

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await executeUpdate(
        "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
        [hashedNewPassword, id]
      );

      logger.info(`Password changed for user: ${id}`);
    } catch (error) {
      logger.error("Error changing password", { error, id });
      throw error;
    }
  }

  /**
   * Authenticate user and generate JWT token
   */
  static async authenticate(
    email: string,
    password: string
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const userWithPassword = await executeQueryOne<{ password: string }>(
        "SELECT password FROM users WHERE id = ?",
        [user.id]
      );

      if (!userWithPassword) {
        throw new Error("User password not found");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userWithPassword.password
      );

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Update last login
      await executeUpdate("UPDATE users SET last_login = NOW() WHERE id = ?", [
        user.id,
      ]);

      // Generate tokens
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          personId: user.personId,
        },
        config.auth.jwtSecret,
        { expiresIn: config.auth.jwtExpiry }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        config.auth.jwtSecret,
        { expiresIn: config.auth.refreshTokenExpiry }
      );

      logger.info(`User authenticated: ${email}`);

      return { user, token, refreshToken };
    } catch (error) {
      logger.error("Error authenticating user", { error, email });
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(id: number): Promise<void> {
    try {
      await executeUpdate("DELETE FROM users WHERE id = ?", [id]);
      logger.info(`User deleted: ${id}`);
    } catch (error) {
      logger.error("Error deleting user", { error, id });
      throw error;
    }
  }

  /**
   * Get user statistics for monitoring
   */
  static async getUserStats(): Promise<{
    totalUsers: number;
    usersByRole: { role: string; count: number }[];
    activeUsers: number;
  }> {
    try {
      const totalResult = await executeQueryOne<{ count: number }>(
        "SELECT COUNT(*) as count FROM users"
      );

      const roleStats = await executeQuery<{ role: string; count: number }>(
        "SELECT role, COUNT(*) as count FROM users GROUP BY role"
      );

      const activeResult = await executeQueryOne<{ count: number }>(
        "SELECT COUNT(*) as count FROM users WHERE status = 'active'"
      );

      return {
        totalUsers: totalResult?.count || 0,
        usersByRole: roleStats,
        activeUsers: activeResult?.count || 0,
      };
    } catch (error) {
      logger.error("Error fetching user statistics", { error });
      throw error;
    }
  }
}

export default UserService;
