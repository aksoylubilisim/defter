import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  picture: { type: String },
  status: { type: String, enum: ['active', 'passive'], default: 'active' },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
