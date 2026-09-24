import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide goal name'],
      trim: true
    },
    target: {
      type: Number,
      required: [true, 'Please provide target amount']
    },
    saved: {
      type: Number,
      default: 0
    },
    deadline: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1, createdAt: -1 });

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;

