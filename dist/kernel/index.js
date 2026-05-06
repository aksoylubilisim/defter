import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AdminUser } from './models/AdminUser.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 6680;
app.use(cors());
app.use(helmet());
app.use(express.json());
// Basic Route
app.get('/', (req, res) => {
    res.send('Defter API is running');
});
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/defter')
    .then(async () => {
    console.log('Connected to MongoDB');
    // Check if adminUsers is empty
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
//# sourceMappingURL=index.js.map