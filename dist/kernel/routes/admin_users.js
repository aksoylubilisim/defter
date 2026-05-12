import express from 'express';
import { AdminUser } from '../models/AdminUser.js';

const router = express.Router();

// List all admin users
router.get('/', async (req, res) => {
  try {
    const users = await AdminUser.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change current admin password
router.post('/me/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await AdminUser.findById(req.admin._id);

    if (admin.password !== currentPassword) {
      return res.status(400).json({ message: 'Mevcut şifre hatalı.' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new admin user
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existing = await AdminUser.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
    }

    const newUser = await AdminUser.create({ username, password });
    const userObj = newUser.toObject();
    delete userObj.password;
    
    res.status(201).json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin user
router.patch('/:id', async (req, res) => {
  try {
    const { username, password } = req.body;
    const updateData = {};
    
    if (username) updateData.username = username;
    if (password) updateData.password = password;

    const user = await AdminUser.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete admin user
router.delete('/:id', async (req, res) => {
  try {
    const adminIdToDelete = req.params.id;
    
    // Check self-deletion using the admin object from middleware
    if (req.admin && req.admin._id.toString() === adminIdToDelete) {
      return res.status(400).json({ message: 'Kendi hesabınızı silemezsiniz.' });
    }

    const count = await AdminUser.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ message: 'Sistemde en az bir yönetici kalmalıdır.' });
    }
    
    await AdminUser.findByIdAndDelete(adminIdToDelete);
    res.json({ message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
