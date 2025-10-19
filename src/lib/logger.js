import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
      })
    ),
  }),

  // Error log file
  new DailyRotateFile({
    filename: path.join(process.cwd(), 'logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
  }),

  // Combined log file
  new DailyRotateFile({
    filename: path.join(process.cwd(), 'logs', 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
  }),

  // HTTP requests log file
  new DailyRotateFile({
    filename: path.join(process.cwd(), 'logs', 'http-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'http',
    maxSize: '20m',
    maxFiles: '7d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),

  // Debug log file (only in development)
  ...(process.env.NODE_ENV !== 'production' ? [
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'debug-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'debug',
      maxSize: '20m',
      maxFiles: '3d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  ] : []),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
  // Do not exit on handled exceptions
  exitOnError: false,
});

// Create a stream object with a 'write' function that will be used by Morgan
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Helper functions for different log types
const loggers = {
  // Error logging
  error: (message, meta = {}) => {
    logger.error(message, { ...meta, timestamp: new Date().toISOString() });
  },

  // Warning logging
  warn: (message, meta = {}) => {
    logger.warn(message, { ...meta, timestamp: new Date().toISOString() });
  },

  // Info logging
  info: (message, meta = {}) => {
    logger.info(message, { ...meta, timestamp: new Date().toISOString() });
  },

  // HTTP request logging
  http: (message, meta = {}) => {
    logger.http(message, { ...meta, timestamp: new Date().toISOString() });
  },

  // Debug logging
  debug: (message, meta = {}) => {
    logger.debug(message, { ...meta, timestamp: new Date().toISOString() });
  },

  // API request logging
  apiRequest: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      logger.error(`API Request Error: ${req.method} ${req.url}`, logData);
    } else {
      logger.http(`API Request: ${req.method} ${req.url}`, logData);
    }
  },

  // Database operation logging
  dbOperation: (operation, table, data = {}) => {
    logger.info(`Database ${operation}`, {
      table,
      data: typeof data === 'object' ? JSON.stringify(data) : data,
      timestamp: new Date().toISOString(),
    });
  },

  // Authentication logging
  auth: (action, user, success = true, details = {}) => {
    const level = success ? 'info' : 'warn';
    logger[level](`Authentication ${action}`, {
      user: user || 'unknown',
      success,
      details,
      timestamp: new Date().toISOString(),
    });
  },

  // File upload logging
  fileUpload: (filename, size, success = true, error = null) => {
    const level = success ? 'info' : 'error';
    logger[level](`File Upload ${success ? 'Success' : 'Failed'}`, {
      filename,
      size: `${(size / 1024).toFixed(2)}KB`,
      success,
      error: error?.message || null,
      timestamp: new Date().toISOString(),
    });
  },

  // Performance logging
  performance: (operation, duration, details = {}) => {
    logger.info(`Performance: ${operation}`, {
      duration: `${duration}ms`,
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
};

export { logger };
export const { error, warn, info, http, debug, apiRequest, dbOperation, auth, fileUpload, performance } = loggers;
export default logger;

// Export all loggers as named exports
export { loggers };
