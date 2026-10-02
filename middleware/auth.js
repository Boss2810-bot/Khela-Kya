const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.KK_SECRET || 'change_this_secret_in_prod';

/**
 * Middleware: require a valid JWT Bearer token.
 * On success, attaches `req.user = { id, email, role }` to the request.
 */
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const match = auth.match(/^Bearer (.+)$/);

  if (!match) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const payload = jwt.verify(match[1], JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Middleware: require the authenticated user to have a specific role.
 * Must be used after authMiddleware.
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'owner')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
