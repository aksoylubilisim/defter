import express from 'express';
import { KasaPage, KasaTransaction } from '../models/Kasa.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get active page
router.get('/active', authMiddleware, async (req, res) => {
  try {
    let page = await KasaPage.findOne({ status: 'open', userId: req.user.userId }).sort({ createdAt: -1 });
    
    if (!page) {
      // Find last closed page to get devir
      const lastPage = await KasaPage.findOne({ status: 'closed', userId: req.user.userId }).sort({ closedAt: -1 });
      const openingBalance = lastPage ? lastPage.closingBalance : 0;
      
      page = await KasaPage.create({ openingBalance, status: 'open', userId: req.user.userId });
    }
    
    const transactions = await KasaTransaction.find({ pageId: page._id }).sort({ createdAt: -1 });
    res.json({ page, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add transaction
router.post('/transaction', authMiddleware, async (req, res) => {
  try {
    const { pageId, type, amount, description } = req.body;
    
    // Verify page belongs to user
    const page = await KasaPage.findOne({ _id: pageId, userId: req.user.userId });
    if (!page) return res.status(403).json({ message: 'Forbidden' });

    const transaction = await KasaTransaction.create({ pageId, type, amount, description });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Close page
router.post('/close', authMiddleware, async (req, res) => {
  try {
    const { pageId, closingBalance } = req.body;
    const page = await KasaPage.findOneAndUpdate({ _id: pageId, userId: req.user.userId }, {
      status: 'closed',
      closingBalance,
      closedAt: new Date()
    }, { new: true });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
