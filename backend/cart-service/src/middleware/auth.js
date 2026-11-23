import { verifyToken } from '../utils/jwt.js';
import { HttpError } from '../utils/httpError.js';

export function requireAuth(req, _res, next) {
  const token = req.header('token');
  if (!token) return next(new HttpError(401, 'Token is required'));

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}
