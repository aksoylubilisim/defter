import mongoose from 'mongoose';
const adminSessionSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    deviceId: { type: String, required: true },
    token: { type: String, required: true },
    lastActive: { type: Date, default: Date.now },
}, { timestamps: true });
export const AdminSession = mongoose.model('AdminSession', adminSessionSchema);
//# sourceMappingURL=AdminSession.js.map