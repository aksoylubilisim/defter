import express from 'express';
import crypto from 'crypto';
import { AdminUser } from '../models/AdminUser.js';
import { AdminSession } from '../models/AdminSession.js';
import { User } from '../models/User.js';
import { UserSession } from '../models/UserSession.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/authMiddleware.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password, deviceId } = req.body;

    const user = await AdminUser.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    
    const session = await AdminSession.create({
      adminId: user._id,
      deviceId: deviceId || 'web-browser',
      token,
      lastActive: new Date()
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential, deviceId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: 'Invalid Google token' });

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({ googleId, email, name, picture });
    }

    if (user.status === 'passive') {
      return res.status(403).json({ message: 'Hesabınız pasif durumdadır. Lütfen yönetici ile iletişime geçin.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1095d' } // 3 years
    );

    // Save session
    await UserSession.create({
      userId: user._id,
      deviceId: deviceId || 'web-browser',
      token,
      lastActive: new Date()
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;
    await UserSession.deleteOne({ token });
    await AdminSession.deleteOne({ token });
    res.json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user sessions
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await UserSession.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Terminate session
router.delete('/sessions/:id', authMiddleware, async (req, res) => {
  try {
    await UserSession.deleteOne({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: 'Session terminated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
