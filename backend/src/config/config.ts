import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || "5000"),
    nodeEnv: process.env.NODE_ENV || "development",
    isDevelopment: (process.env.NODE_ENV || "development") === "development",
    isProduction: (process.env.NODE_ENV || "development") === "production",
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "akilihub_sms",
    // Connection pooling for 2000+ concurrent users
    connectionLimit: parseInt(process.env.DB_POOL_SIZE || "100"),
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || "200"),
    enableKeepAlive: true,
  },

  // Redis Configuration (for caching and sessions)
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || "",
    db: parseInt(process.env.REDIS_DB || "0"),
    ttl: parseInt(process.env.REDIS_TTL || "3600"), // 1 hour default TTL
    enabled: process.env.REDIS_ENABLED !== "false",
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    jwtExpiry: process.env.JWT_EXPIRY || "24h",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH || "6"),
  },

  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || "http://localhost:5000",
    prefix: process.env.API_PREFIX || "/api",
    version: process.env.API_VERSION || "v1",
    corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000").split(","),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
    filePath: process.env.LOG_FILE_PATH || "./logs",
    maxSize: parseInt(process.env.LOG_MAX_SIZE || "10485760"), // 10MB
    maxFiles: parseInt(process.env.LOG_MAX_FILES || "10"),
  },

  // Performance Configuration
  performance: {
    compressionLevel: parseInt(process.env.COMPRESSION_LEVEL || "6"),
    maxJsonSize: process.env.MAX_JSON_SIZE || "10mb",
    maxUrlEncodedSize: process.env.MAX_URLENCODED_SIZE || "10mb",
    cacheEnabled: process.env.CACHE_ENABLED !== "false",
    cacheTTL: parseInt(process.env.CACHE_TTL || "3600"),
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "52428800"), // 50MB
    uploadDir: process.env.UPLOAD_DIR || "./uploads",
    allowedMimeTypes: (
      process.env.ALLOWED_MIME_TYPES ||
      "image/jpeg,image/png,image/gif,application/pdf,text/csv"
    ).split(","),
  },

  // Email Configuration (for notifications)
  email: {
    service: process.env.EMAIL_SERVICE || "gmail",
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    from: process.env.EMAIL_FROM || "noreply@akilihub.com",
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
  },

  // Feature Flags
  features: {
    auditLogging: process.env.AUDIT_LOGGING !== "false",
    analyticsTracking: process.env.ANALYTICS_TRACKING !== "false",
    notificationsEnabled: process.env.NOTIFICATIONS_ENABLED !== "false",
    twoFactorAuth: process.env.TWO_FACTOR_AUTH === "true",
  },

  // Monitoring & Analytics
  monitoring: {
    enabled: process.env.MONITORING_ENABLED !== "false",
    metricsPort: parseInt(process.env.METRICS_PORT || "9090"),
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || "30000"),
  },
};

/**
 * Validate critical configuration values
 */
export function validateConfig(): void {
  const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];

  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missing.length > 0 && config.server.isProduction) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  if (missing.length > 0) {
    console.warn(
      `WARNING: Missing environment variables: ${missing.join(", ")}`
    );
  }
}

export default config;
