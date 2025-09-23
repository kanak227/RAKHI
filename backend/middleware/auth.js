const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

/**
 * Generate JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '24h'
  });
};

/**
 * Middleware to check if user is victim
 */
const requireVictim = (req, res, next) => {
  if (req.user.role !== 'victim') {
    return res.status(403).json({ error: 'Victim access required' });
  }
  next();
};

/**
 * Middleware to check if user is ally
 */
const requireAlly = (req, res, next) => {
  if (req.user.role !== 'ally') {
    return res.status(403).json({ error: 'Ally access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  generateToken,
  requireVictim,
  requireAlly
};

