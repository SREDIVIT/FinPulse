import Goal from '../models/Goal.js';
import Transaction from '../models/Transaction.js';
import Notification from '../models/Notification.js';

// @desc Get all savings goals
// @route GET /api/goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single goal by ID
// @route GET /api/goals/:id
export const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create savings goal
// @route POST /api/goals
export const createGoal = async (req, res) => {
  try {
    const { name, target, saved, deadline, notes } = req.body;

    if (!name || !target || !deadline) {
      return res.status(400).json({ message: 'Name, target, and deadline are required' });
    }

    const goal = await Goal.create({
      userId: req.user._id,
      name,
      target: parseFloat(target),
      saved: saved ? parseFloat(saved) : 0,
      deadline,
      notes: notes || ''
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update goal
// @route PUT /api/goals/:id
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.name = req.body.name ?? goal.name;
    goal.target = req.body.target !== undefined ? parseFloat(req.body.target) : goal.target;
    goal.saved = req.body.saved !== undefined ? parseFloat(req.body.saved) : goal.saved;
    goal.deadline = req.body.deadline ?? goal.deadline;
    goal.notes = req.body.notes ?? goal.notes;

    const updated = await goal.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add funds / deposit to goal
// @route POST /api/goals/:id/deposit
export const addDepositToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid deposit amount' });
    }

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.saved += depositAmount;
    await goal.save();

    // Create a corresponding transaction entry
    await Transaction.create({
      userId: req.user._id,
      description: `Goal transfer: ${goal.name}`,
      amount: depositAmount,
      category: 'Savings',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      notes: `Fund allocation to savings goal: ${goal.name}`
    });

    // Check if goal reached or progress notification
    if (goal.saved >= goal.target) {
      await Notification.create({
        userId: req.user._id,
        title: 'Goal Achieved! 🎉',
        message: `Congratulations! You have reached your savings goal: "${goal.name}" (₹${goal.saved}/₹${goal.target}).`,
        type: 'success'
      });
    } else {
      await Notification.create({
        userId: req.user._id,
        title: 'Goal Progress',
        message: `Savings goal "${goal.name}" increased by ₹${depositAmount}.`,
        type: 'success'
      });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete goal
// @route DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
