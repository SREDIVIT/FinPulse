import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      trim: true
    },
    limit: {
      type: Number,
      required: [true, 'Please provide budget limit']
    },
    startDate: {
      type: String,
      default: '2026-08-01'
    },
    endDate: {
      type: String,
      default: '2026-08-31'
    },
    threshold: {
      type: Number,
      default: 80
    }
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, category: 1 });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;

