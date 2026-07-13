/**
 * Utility functions for validation, hashing, JWT, and other common operations
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import crypto from "crypto";

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: any, expiresIn: string = config.auth.jwtExpiry): string {
  return jwt.sign(payload, config.auth.jwtSecret, { expiresIn });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(userId: number): string {
  return jwt.sign({ id: userId }, config.auth.jwtSecret, {
    expiresIn: config.auth.refreshTokenExpiry,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, config.auth.jwtSecret);
  } catch (error) {
    return null;
  }
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 12): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Format date to MySQL format
 */
export function formatDateToMySQL(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

/**
 * Format date to readable format
 */
export function formatDateReadable(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Generate random password
 */
export function generateRandomPassword(length: number = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Sanitize SQL string
 */
export function sanitizeString(str: string): string {
  return str.replace(/[^\w\s\-\.@]/g, "").trim();
}

/**
 * Flatten nested object
 */
export function flattenObject(obj: any, parent = "", res: any = {}): any {
  for (let key in obj) {
    const newKey = parent ? parent + "." + key : key;
    if (obj[key] === null || obj[key] === undefined) {
      res[newKey] = obj[key];
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      flattenObject(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }
  return res;
}

/**
 * Calculate age from birthdate
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = "KES"): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export default {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateRandomString,
  formatDateToMySQL,
  formatDateReadable,
  isValidEmail,
  isValidPhone,
  calculatePercentage,
  generateRandomPassword,
  sanitizeString,
  flattenObject,
  calculateAge,
  formatCurrency,
};
