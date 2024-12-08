import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Fix for undefined IP
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  }
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  }
});