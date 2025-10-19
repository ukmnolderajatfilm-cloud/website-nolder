const { logger } = require('../lib/logger');

/**
 * Request logging middleware
 * Logs all incoming HTTP requests with details
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log the incoming request
  logger.http('Incoming Request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString(),
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    
    // Log the response
    logger.apiRequest(req, res, responseTime);
    
    // Call the original end method
    originalEnd.call(this, chunk, encoding);
  };

  if (next) {
    next();
  }
};

module.exports = requestLogger;
