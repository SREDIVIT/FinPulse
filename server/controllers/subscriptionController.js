import Subscription from '../models/Subscription.js';
import Transaction from '../models/Transaction.js';

// @desc Get all subscriptions
// @route GET /api/subscriptions
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id }).sort({ nextPayment: 1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single subscription by ID
// @route GET /api/subscriptions/:id
export const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, userId: req.user._id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create subscription
// @route POST /api/subscriptions
export const createSubscription = async (req, res) => {
  try {
    const { name, cost, billingCycle, category, nextPayment, status } = req.body;

    if (!name || !cost || !nextPayment) {
      return res.status(400).json({ message: 'Name, cost, and next payment date are required' });
    }

    const subscription = await Subscription.create({
      userId: req.user._id,
      name,
      cost: parseFloat(cost),
      billingCycle: billingCycle || 'monthly',
      category: category || 'Bills',
      nextPayment,
      status: status || 'active'
    });

    // Also record transaction
    await Transaction.create({
      userId: req.user._id,
      description: `${subscription.name} Subscription`,
      amount: parseFloat(cost),
      category: category || 'Bills',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Card',
      notes: 'Subscription billing registration'
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update subscription
// @route PUT /api/subscriptions/:id
export const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, userId: req.user._id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.name = req.body.name ?? subscription.name;
    subscription.cost = req.body.cost !== undefined ? parseFloat(req.body.cost) : subscription.cost;
    subscription.billingCycle = req.body.billingCycle ?? subscription.billingCycle;
    subscription.category = req.body.category ?? subscription.category;
    subscription.nextPayment = req.body.nextPayment ?? subscription.nextPayment;
    subscription.status = req.body.status ?? subscription.status;

    const updated = await subscription.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete subscription
// @route DELETE /api/subscriptions/:id
export const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json({ message: 'Subscription removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
