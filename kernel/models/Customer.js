import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  balance: { type: Number, default: 0 }, // Positive: debt, Negative: credit (payment)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const customerTransactionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, enum: ['debt', 'payment'], required: true },
  amount: { type: Number, required: true },
  notes: { type: String },
}, { timestamps: true });

export const Customer = mongoose.model('Customer', customerSchema);
export const CustomerTransaction = mongoose.model('CustomerTransaction', customerTransactionSchema);
