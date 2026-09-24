import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Notification from '../models/Notification.js';

// @desc Get all transactions for logged in user
// @route GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const { category, type, startDate, endDate, search } = req.query;
    const filter = { userId: req.user._id };

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (type && type !== 'All') {
      filter.type = type;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }
    if (search) {
      filter.description = { $regex: search, $options: 'i' };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single transaction by ID
// @route GET /api/transactions/:id
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new transaction
// @route POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date, paymentMethod, notes } = req.body;

    if (!description || !amount || !type || !category) {
      return res.status(400).json({ message: 'Description, amount, type, and category are required' });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: date || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'UPI',
      notes: notes || ''
    });

    // Check budget thresholds if expense
    if (type === 'expense') {
      const budget = await Budget.findOne({
        userId: req.user._id,
        category: { $regex: new RegExp(`^${category}$`, 'i') }
      });

      if (budget) {
        // Calculate current spending for this category
        const currentMonthPrefix = (date || new Date().toISOString().split('T')[0]).slice(0, 7);
        const monthlyExpenses = await Transaction.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(req.user._id),
              type: 'expense',
              category: { $regex: new RegExp(`^${category}$`, 'i') },
              date: { $regex: `^${currentMonthPrefix}` }
            }
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: '$amount' }
            }
          }
        ]);

        const totalSpent = monthlyExpenses[0]?.totalSpent || 0;
        const percentage = (totalSpent / budget.limit) * 100;

        if (percentage >= 100) {
          await Notification.create({
            userId: req.user._id,
            title: 'Budget Exceeded',
            message: `Alert! You have exceeded your ${budget.category} budget of ₹${budget.limit}. Total spent: ₹${totalSpent}.`,
            type: 'danger'
          });
        } else if (percentage >= (budget.threshold || 80)) {
          await Notification.create({
            userId: req.user._id,
            title: 'Budget Warning',
            message: `${budget.category} budget is ${Math.round(percentage)}% used. Spent ₹${totalSpent} of ₹${budget.limit}.`,
            type: 'warning'
          });
        }
      }
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update transaction
// @route PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.description = req.body.description ?? transaction.description;
    transaction.amount = req.body.amount !== undefined ? parseFloat(req.body.amount) : transaction.amount;
    transaction.type = req.body.type ?? transaction.type;
    transaction.category = req.body.category ?? transaction.category;
    transaction.date = req.body.date ?? transaction.date;
    transaction.paymentMethod = req.body.paymentMethod ?? transaction.paymentMethod;
    transaction.notes = req.body.notes ?? transaction.notes;

    const updated = await transaction.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete transaction
// @route DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
