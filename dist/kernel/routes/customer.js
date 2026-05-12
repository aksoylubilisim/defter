import express from 'express';
import { Customer, CustomerTransaction } from '../models/Customer.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// List all customers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.userId }).sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.create({ ...req.body, userId: req.user.userId });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer detail & transactions
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const transactions = await CustomerTransaction.find({ customerId: req.params.id }).sort({ createdAt: -1 });
    res.json({ customer, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add customer transaction (debt or payment)
router.post('/transaction', authMiddleware, async (req, res) => {
  try {
    const { customerId, type, amount, notes } = req.body;

    // Verify customer belongs to user
    const customer = await Customer.findOne({ _id: customerId, userId: req.user.userId });
    if (!customer) return res.status(403).json({ message: 'Forbidden' });

    const transaction = await CustomerTransaction.create({ customerId, type, amount, notes });
    
    // Update customer balance
    // Debt increases balance, payment decreases balance
    const balanceChange = type === 'debt' ? amount : -amount;
    await Customer.updateOne({ _id: customerId }, { $inc: { balance: balanceChange } });
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
