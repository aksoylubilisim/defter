import mongoose from 'mongoose';

const kasaPageSchema = new mongoose.Schema({
  openingBalance: { type: Number, default: 0 },
  closingBalance: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  openedAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
}, { timestamps: true });

const kasaTransactionSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'KasaPage', required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export const KasaPage = mongoose.model('KasaPage', kasaPageSchema);
export const KasaTransaction = mongoose.model('KasaTransaction', kasaTransactionSchema);
