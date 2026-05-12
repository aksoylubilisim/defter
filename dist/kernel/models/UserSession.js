import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },
  token: { type: String, required: true },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

export const UserSession = mongoose.model('UserSession', userSessionSchema);
