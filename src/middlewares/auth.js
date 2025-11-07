// src/middlewares/auth.js
import jwt from 'jsonwebtoken';

export function auth(required = true) {
  return (req, res, next) => {
    try {
      const hdr = req.headers.authorization || '';
      const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
      if (!token) {
        if (!required) return next();
        return res.status(401).json({ errCode: 401, message: 'Unauthorized' });
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.sub;
      req.userRole = payload.role;
      next();
    } catch (e) {
      return res.status(401).json({ errCode: 401, message: 'Invalid token' });
    }
  };
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.userRole !== role) {
      return res.status(403).json({ errCode: 403, message: 'Forbidden' });
    }
    next();
  };
}
