import { AdminSession } from '../models/AdminSession.js';

export const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const session = await AdminSession.findOne({ token }).populate('adminId');
    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    req.admin = session.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth error' });
  }
};
