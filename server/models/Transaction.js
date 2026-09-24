import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      required: [true, 'Please provide transaction description'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Please provide transaction amount']
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true
    },
    category: {
      type: String,
      required: [true, 'Please provide transaction category'],
      trim: true
    },
    date: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split('T')[0]
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'Bank Transfer', 'Cash'],
      default: 'UPI'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Indexes for high performance querying
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
