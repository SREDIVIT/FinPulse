import mongoose from 'mongoose';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

// @desc Get all budgets with calculated spent amount
// @route GET /api/budgets
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });

    // Aggregate expenses for the active user
    const expensesByCategory = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          type: 'expense'
        }
      },
      {
        $group: {
          _id: { $toLower: '$category' },
          spent: { $sum: '$amount' }
        }
      }
    ]);

    const spendingMap = {};
    expensesByCategory.forEach(item => {
      spendingMap[item._id] = item.spent;
    });

    const enrichedBudgets = budgets.map(b => {
      const spent = spendingMap[b.category.toLowerCase()] || 0;
      return {
        ...b.toObject(),
        spent,
        percentage: b.limit > 0 ? Math.min(100, Math.round((spent / b.limit) * 100)) : 0
      };
    });

    res.json(enrichedBudgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single budget by ID
// @route GET /api/budgets/:id
export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          type: 'expense',
          category: { $regex: new RegExp(`^${budget.category}$`, 'i') }
        }
      },
      {
        $group: {
          _id: null,
          spent: { $sum: '$amount' }
        }
      }
    ]);

    const spent = expenses[0]?.spent || 0;
    res.json({
      ...budget.toObject(),
      spent,
      percentage: budget.limit > 0 ? Math.min(100, Math.round((spent / budget.limit) * 100)) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a new budget
// @route POST /api/budgets
export const createBudget = async (req, res) => {
  try {
    const { category, limit, startDate, endDate, threshold } = req.body;

    if (!category || !limit) {
      return res.status(400).json({ message: 'Category and limit are required' });
    }

    const budget = await Budget.create({
      userId: req.user._id,
      category,
      limit: parseFloat(limit),
      startDate: startDate || '2026-08-01',
      endDate: endDate || '2026-08-31',
      threshold: threshold ? parseInt(threshold) : 80
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update budget
// @route PUT /api/budgets/:id
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.category = req.body.category ?? budget.category;
    budget.limit = req.body.limit !== undefined ? parseFloat(req.body.limit) : budget.limit;
    budget.threshold = req.body.threshold !== undefined ? parseInt(req.body.threshold) : budget.threshold;
    budget.startDate = req.body.startDate ?? budget.startDate;
    budget.endDate = req.body.endDate ?? budget.endDate;

    const updated = await budget.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete budget
// @route DELETE /api/budgets/:id
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
