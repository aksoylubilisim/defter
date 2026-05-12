import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AdminUser } from './models/AdminUser.js';
import authRoutes from './routes/auth.js';
import kasaRoutes from './routes/kasa.js';
import customerRoutes from './routes/customer.js';
import adminMemberRoutes from './routes/admin_members.js';
import adminUserRoutes from './routes/admin_users.js';
import { adminAuthMiddleware } from './middleware/adminAuthMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6680;

app.use(cors());
app.use(helmet());
app.use(express.json());

const getAppStatus = () => ({
  status: true,
  message: 'Defter Kernel API is running',
  data: {
    name: 'defter-kernel',
    version: '1.0.1',
    description: 'Defter Ledger Management System Core API',
    uptime: Math.floor(process.uptime()) + 's',
    timestamp: new Date().toISOString()
  }
});

app.get('/', (req, res) => {
  res.status(200).json(getAppStatus());
});

app.use('/api/auth', authRoutes);
app.use('/api/kasa', kasaRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin/members', adminAuthMiddleware, adminMemberRoutes);
app.use('/api/admin/users', adminAuthMiddleware, adminUserRoutes);

app.get('/api', (req, res) => {
  res.status(200).json(getAppStatus());
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/defter')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const count = await AdminUser.countDocuments();
    if (count === 0) {
      await AdminUser.create({
        username: 'admin',
        password: 'Admin!234',
      });
      console.log('Default admin user created');
    }
    
    app.listen(PORT, () => {
      console.log(`Kernel is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
