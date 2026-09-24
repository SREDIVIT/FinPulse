import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

// @desc Get financial summary (Income, Expense, Balance, Savings)
// @route GET /api/analytics/summary
export const getSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let income = 0;
    let expense = 0;

    summary.forEach(item => {
      if (item._id === 'income') income = item.total;
      if (item._id === 'expense') expense = item.total;
    });

    const savings = Math.max(0, income - expense);
    const balance = income - expense;

    res.json({
      income,
      expense,
      savings,
      balance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get category-wise spending aggregation
// @route GET /api/analytics/categories
export const getCategoryBreakdown = async (req, res) => {
  try {
    const breakdown = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          type: 'expense'
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalAmount: -1 }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalAmount: 1,
          count: 1
        }
      }
    ]);

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get monthly cashflow trends
// @route GET /api/analytics/monthly-trends
export const getMonthlyTrends = async (req, res) => {
  try {
    const trends = await Transaction.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
      },
      {
        $group: {
          _id: {
            month: { $substrCP: [{ $ifNull: ['$date', '2026-08-01'] }, 0, 7] },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    // Reshape for frontend Recharts
    const monthMap = {};
    trends.forEach(item => {
      const month = item._id.month;
      if (!monthMap[month]) {
        monthMap[month] = { month, income: 0, expense: 0 };
      }
      if (item._id.type === 'income') monthMap[month].income = item.total;
      if (item._id.type === 'expense') monthMap[month].expense = item.total;
    });

    res.json(Object.values(monthMap));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Anomaly detection via statistical aggregation
// @route GET /api/analytics/anomalies
export const getAnomalies = async (req, res) => {
  try {
    // Calculate expense stats
    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          type: 'expense'
        }
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$amount' },
          stdDev: { $stdDevPop: '$amount' }
        }
      }
    ]);

    if (!stats.length || !stats[0].avg) {
      return res.json([]);
    }

    const threshold = stats[0].avg + (stats[0].stdDev ? stats[0].stdDev * 1.5 : 5000);

    const anomalies = await Transaction.find({
      userId: req.user._id,
      type: 'expense',
      amount: { $gte: threshold }
    }).sort({ amount: -1 });

    const formatted = anomalies.map(a => ({
      id: a._id.toString(),
      description: a.description,
      amount: a.amount,
      category: a.category,
      date: a.date,
      confidence: 88,
      message: `Transaction of ₹${a.amount} is significantly higher than your typical average (₹${Math.round(stats[0].avg)}).`,
      resolved: false
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
