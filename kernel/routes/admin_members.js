import express from 'express';
import { User } from '../models/User.js';
import { KasaPage } from '../models/Kasa.js';
import { Customer } from '../models/Customer.js';
import { UserSession } from '../models/UserSession.js';
import { KasaTransaction } from '../models/Kasa.js';
import si from 'systeminformation';

const router = express.Router();

// List all members with stats (Paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const customerCount = await Customer.countDocuments({ userId: user._id });
      const kasaPageCount = await KasaPage.countDocuments({ userId: user._id });
      const activeSessions = await UserSession.countDocuments({ userId: user._id });
      
      return {
        ...user.toObject(),
        stats: {
          customerCount,
          kasaPageCount,
          activeSessions
        }
      };
    }));

    res.json({
      data: usersWithStats,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status (active/passive)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (status === 'passive') {
      // Terminate all sessions for this user
      await UserSession.deleteMany({ userId: user._id });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user and all their data
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    await Customer.deleteMany({ userId });
    await KasaPage.deleteMany({ userId });
    await UserSession.deleteMany({ userId });
    
    res.json({ message: 'User and all associated data deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Impersonate user (Login As)
router.post('/:id/login-as', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    // Generate a token (using same logic as user login)
    // Note: If using JWT, sign a new one. Here we use crypto tokens like AdminSession but for users.
    // Let's check how users login in auth.js. It uses JWT.
    
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    // Create a session
    await UserSession.create({
      userId: user._id,
      deviceId: 'admin-impersonation',
      token,
      lastActive: new Date()
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeKasaPages = await KasaPage.countDocuments({ status: 'open' });
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyTransactions = await KasaTransaction.countDocuments({ createdAt: { $gte: last24h } });
    const totalSessions = await UserSession.countDocuments();
    
    // System Health
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const fs = await si.fsSize();

    // Recent Activities
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentPages = await KasaPage.find().populate('userId').sort({ createdAt: -1 }).limit(5);
    const recentTransactions = await KasaTransaction.find()
      .populate({ path: 'pageId', populate: { path: 'userId' } })
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = [
      ...recentUsers.map(u => ({
        user: u.name,
        action: 'Yeni Üye Kaydı',
        time: u.createdAt,
        status: 'Tamamlandı'
      })),
      ...recentPages.map(p => ({
        user: p.userId?.name || 'Bilinmiyor',
        action: 'Kasa Sayfası Açtı',
        time: p.createdAt,
        status: 'Tamamlandı'
      })),
      ...recentTransactions.map(t => ({
        user: t.pageId?.userId?.name || 'Bilinmiyor',
        action: `${t.type === 'in' ? 'Para Girişi' : 'Para Çıkışı'} (${t.amount} TL)`,
        time: t.createdAt,
        status: 'Tamamlandı'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    res.json({
      totalUsers,
      activeKasaPages,
      dailyTransactions,
      systemLoad: totalSessions,
      health: {
        cpu: Math.round(cpu.currentLoad),
        mem: Math.round((mem.active / mem.total) * 100),
        disk: Math.round(fs[0] ? fs[0].use : 0)
      },
      recentActivities: activities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
