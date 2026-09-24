import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide subscription name'],
      trim: true
    },
    cost: {
      type: Number,
      required: [true, 'Please provide cost']
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    },
    category: {
      type: String,
      default: 'Entertainment'
    },
    nextPayment: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled'],
      default: 'active'
    }
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;

